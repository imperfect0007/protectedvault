import {
  PDFDocument,
  PDFName,
  PDFRawStream,
  PDFNumber,
  PDFDict,
} from 'pdf-lib';
import sharp from 'sharp';
import zlib from 'zlib';

const JPEG_QUALITY = 60;
const MAX_DIM = 1500;
const MIN_PIXELS = 2500;

export async function compressPDF(input: Buffer): Promise<Buffer> {
  const doc = await PDFDocument.load(input, { ignoreEncryption: true });
  const ctx = doc.context;

  const jobs: Promise<void>[] = [];

  ctx.enumerateIndirectObjects().forEach(([ref, obj]: [any, any]) => {
    if (!(obj instanceof PDFRawStream)) return;

    const dict = obj.dict as PDFDict;
    if (dict.get(PDFName.of('Subtype')) !== PDFName.of('Image')) return;

    const w = pdfNum(dict, 'Width');
    const h = pdfNum(dict, 'Height');
    if (!w || !h || w * h < MIN_PIXELS) return;

    if (dict.get(PDFName.of('SMask')) || dict.get(PDFName.of('Mask'))) return;

    const filter = dict.get(PDFName.of('Filter'));

    if (filter === PDFName.of('DCTDecode')) {
      jobs.push(squashJPEG(ctx, ref, obj, dict, w, h));
    } else if (filter === PDFName.of('FlateDecode') && !dict.get(PDFName.of('DecodeParms'))) {
      jobs.push(squashRaw(ctx, ref, obj, dict, w, h));
    }
  });

  await Promise.all(jobs);

  doc.setTitle('');
  doc.setAuthor('');
  doc.setSubject('');
  doc.setKeywords([]);
  doc.setProducer('');
  doc.setCreator('');

  return Buffer.from(await doc.save({ useObjectStreams: true }));
}

function pdfNum(dict: PDFDict, key: string): number | undefined {
  const v = dict.get(PDFName.of(key));
  return v instanceof PDFNumber ? v.asNumber() : undefined;
}

function needsResize(w: number, h: number): boolean {
  return w > MAX_DIM || h > MAX_DIM;
}

function replaceImage(
  ctx: any,
  ref: any,
  dict: PDFDict,
  data: Buffer,
  w: number,
  h: number,
) {
  dict.set(PDFName.of('Width'), PDFNumber.of(w));
  dict.set(PDFName.of('Height'), PDFNumber.of(h));
  dict.set(PDFName.of('Length'), PDFNumber.of(data.length));
  ctx.assign(ref, PDFRawStream.of(dict, data));
}

async function squashJPEG(
  ctx: any,
  ref: any,
  stream: PDFRawStream,
  dict: PDFDict,
  w: number,
  h: number,
) {
  try {
    const original = Buffer.from(stream.contents);

    let pipe = sharp(original);
    if (needsResize(w, h)) {
      pipe = pipe.resize(MAX_DIM, MAX_DIM, { fit: 'inside', withoutEnlargement: true });
    }

    const out = await pipe.jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toBuffer();

    if (out.length >= original.length * 0.92) return;

    const meta = await sharp(out).metadata();
    replaceImage(ctx, ref, dict, out, meta?.width ?? w, meta?.height ?? h);
  } catch {
    /* image format sharp can't handle — skip */
  }
}

async function squashRaw(
  ctx: any,
  ref: any,
  stream: PDFRawStream,
  dict: PDFDict,
  w: number,
  h: number,
) {
  try {
    const cs = dict.get(PDFName.of('ColorSpace'));
    let channels: 1 | 3 | 4;
    if (cs === PDFName.of('DeviceRGB')) channels = 3;
    else if (cs === PDFName.of('DeviceGray')) channels = 1;
    else return;

    if (pdfNum(dict, 'BitsPerComponent') !== 8) return;

    const pixels = zlib.inflateSync(Buffer.from(stream.contents));
    if (pixels.length !== w * h * channels) return;

    let pipe = sharp(pixels, { raw: { width: w, height: h, channels } });
    if (needsResize(w, h)) {
      pipe = pipe.resize(MAX_DIM, MAX_DIM, { fit: 'inside', withoutEnlargement: true });
    }

    const out = await pipe.jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toBuffer();

    if (out.length >= stream.contents.length * 0.85) return;

    const meta = await sharp(out).metadata();

    dict.set(PDFName.of('Filter'), PDFName.of('DCTDecode'));
    dict.set(PDFName.of('ColorSpace'), PDFName.of('DeviceRGB'));
    dict.set(PDFName.of('BitsPerComponent'), PDFNumber.of(8));
    const dp = PDFName.of('DecodeParms');
    if (dict.get(dp)) dict.delete(dp);

    replaceImage(ctx, ref, dict, out, meta?.width ?? w, meta?.height ?? h);
  } catch {
    /* decompression or encoding failed — skip */
  }
}
