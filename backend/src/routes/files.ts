import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import supabase from '../db';
import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';
import { compressPDF } from '../compress';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Only PDF files are allowed'));
  },
});

const router = Router();
router.use(authMiddleware);

const FILE_LIST_COLS = 'file_id, type, title, original_size, compressed_size, created_at, updated_at';

router.get('/', async (req: AuthRequest, res: Response) => {
  const { data: files, error } = await supabase
    .from('files')
    .select(FILE_LIST_COLS)
    .eq('vault_id', req.vaultId!)
    .order('updated_at', { ascending: false });

  if (error) { res.status(500).json({ error: error.message }); return; }
  res.json({ files: files ?? [] });
});

router.post('/note', async (req: AuthRequest, res: Response) => {
  const { title } = req.body;
  const fileId = uuidv4();

  const { error } = await supabase.from('files').insert({
    file_id: fileId,
    vault_id: req.vaultId!,
    type: 'note',
    title: title || 'Untitled',
    content: '',
  });
  if (error) { res.status(500).json({ error: error.message }); return; }

  const { data: file } = await supabase
    .from('files')
    .select(FILE_LIST_COLS)
    .eq('file_id', fileId)
    .single();

  res.json({ file });
});

router.post('/pdf', upload.single('file'), async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    const originalSize = req.file.size;
    const fileId = uuidv4();
    const fileName = `${fileId}.pdf`;

    let compressedBuffer: Buffer;
    try {
      compressedBuffer = await compressPDF(req.file.buffer);
    } catch {
      compressedBuffer = req.file.buffer;
    }

    const { error: storageError } = await supabase.storage
      .from('pdfs')
      .upload(fileName, compressedBuffer, { contentType: 'application/pdf' });

    if (storageError) {
      res.status(500).json({ error: storageError.message });
      return;
    }

    const compressedSize = compressedBuffer.length;
    const title = req.body.title || req.file.originalname || 'Untitled.pdf';

    const { error: dbError } = await supabase.from('files').insert({
      file_id: fileId,
      vault_id: req.vaultId!,
      type: 'pdf',
      title,
      file_path: fileName,
      original_size: originalSize,
      compressed_size: compressedSize,
    });

    if (dbError) { res.status(500).json({ error: dbError.message }); return; }

    const { data: file } = await supabase
      .from('files')
      .select(FILE_LIST_COLS)
      .eq('file_id', fileId)
      .single();

    res.json({ file });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:fileId', async (req: AuthRequest, res: Response) => {
  const { data: file } = await supabase
    .from('files')
    .select('*')
    .eq('file_id', req.params.fileId)
    .eq('vault_id', req.vaultId!)
    .single();

  if (!file) { res.status(404).json({ error: 'File not found' }); return; }

  if (file.type === 'note') {
    res.json({ file });
  } else {
    res.json({
      file: {
        file_id: file.file_id, type: file.type, title: file.title,
        original_size: file.original_size, compressed_size: file.compressed_size,
        created_at: file.created_at, updated_at: file.updated_at,
      },
    });
  }
});

router.get('/:fileId/pdf', async (req: AuthRequest, res: Response) => {
  const { data: file } = await supabase
    .from('files')
    .select('*')
    .eq('file_id', req.params.fileId)
    .eq('vault_id', req.vaultId!)
    .eq('type', 'pdf')
    .single();

  if (!file) { res.status(404).json({ error: 'File not found' }); return; }

  const { data: blob, error } = await supabase.storage
    .from('pdfs')
    .download(file.file_path);

  if (error || !blob) {
    res.status(404).json({ error: 'PDF file missing from storage' });
    return;
  }

  const buffer = Buffer.from(await blob.arrayBuffer());
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Length', buffer.length.toString());
  res.setHeader('Content-Disposition', `inline; filename="${file.title}"`);
  res.end(buffer);
});

router.put('/:fileId', async (req: AuthRequest, res: Response) => {
  const { title, content } = req.body;

  const { data: file } = await supabase
    .from('files')
    .select('*')
    .eq('file_id', req.params.fileId)
    .eq('vault_id', req.vaultId!)
    .single();

  if (!file) { res.status(404).json({ error: 'File not found' }); return; }

  const updates: Record<string, any> = { updated_at: new Date().toISOString() };
  if (title !== undefined) updates.title = title;
  if (content !== undefined && file.type === 'note') updates.content = content;

  await supabase
    .from('files')
    .update(updates)
    .eq('file_id', file.file_id);

  const { data: updated } = await supabase
    .from('files')
    .select(FILE_LIST_COLS)
    .eq('file_id', file.file_id)
    .single();

  res.json({ file: updated });
});

router.delete('/:fileId', async (req: AuthRequest, res: Response) => {
  const { data: file } = await supabase
    .from('files')
    .select('*')
    .eq('file_id', req.params.fileId)
    .eq('vault_id', req.vaultId!)
    .single();

  if (!file) { res.status(404).json({ error: 'File not found' }); return; }

  if (file.type === 'pdf' && file.file_path) {
    await supabase.storage.from('pdfs').remove([file.file_path]);
  }

  await supabase.from('files').delete().eq('file_id', file.file_id);
  res.json({ success: true });
});

export default router;
