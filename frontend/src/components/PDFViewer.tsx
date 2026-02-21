import { useState, useEffect } from 'react';
import { VaultFile } from '../types';
import { api } from '../api';

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function PDFViewer({ file }: { file: VaultFile }) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const url = api.getPDFUrl(file.file_id);
    setPdfUrl(url);
    setLoading(false);
  }, [file.file_id]);

  const reduction =
    file.original_size && file.compressed_size
      ? ((1 - file.compressed_size / file.original_size) * 100).toFixed(1)
      : null;

  return (
    <div className="pdf-viewer">
      <div className="pdf-viewer-header">
        <h3>{file.title}</h3>
        {file.original_size != null && file.compressed_size != null && (
          <div className="pdf-stats">
            <span className="stat-original">{formatSize(file.original_size)}</span>
            <span className="stat-arrow">\u2192</span>
            <span className="stat-compressed">{formatSize(file.compressed_size)}</span>
            {reduction && Number(reduction) > 0 && (
              <span className="stat-reduction">{reduction}% smaller</span>
            )}
          </div>
        )}
      </div>
      <div className="pdf-viewer-content">
        {loading ? (
          <div className="center-loader">Loading PDF...</div>
        ) : pdfUrl ? (
          <iframe
            src={pdfUrl}
            title={file.title}
            width="100%"
            height="100%"
            style={{ border: 'none' }}
          />
        ) : (
          <div className="center-loader">Failed to load PDF</div>
        )}
      </div>
    </div>
  );
}
