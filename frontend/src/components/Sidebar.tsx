import { useState, useRef } from 'react';
import { VaultFile } from '../types';

interface Props {
  files: VaultFile[];
  activeFileId: string | null;
  onSelect: (id: string) => void;
  onCreateNote: () => void;
  onUploadPDF: (file: File) => void;
  onRename: (id: string, title: string) => void;
  onDelete: (id: string) => void;
}

export default function Sidebar({
  files,
  activeFileId,
  onSelect,
  onCreateNote,
  onUploadPDF,
  onRename,
  onDelete,
}: Props) {
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startRename = (e: React.MouseEvent, file: VaultFile) => {
    e.stopPropagation();
    setRenamingId(file.file_id);
    setRenameValue(file.title);
  };

  const commitRename = () => {
    if (renamingId && renameValue.trim()) {
      onRename(renamingId, renameValue.trim());
    }
    setRenamingId(null);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onUploadPDF(file);
    e.target.value = '';
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h3>Files</h3>
      </div>

      <div className="sidebar-files">
        {files.length === 0 && (
          <div className="sidebar-empty">No files yet. Create one below.</div>
        )}
        {files.map((f) => (
          <div
            key={f.file_id}
            className={`sidebar-file ${activeFileId === f.file_id ? 'active' : ''}`}
            onClick={() => onSelect(f.file_id)}
          >
            <span className="file-icon">
              {f.type === 'note' ? '\uD83D\uDCDD' : '\uD83D\uDCC4'}
            </span>
            {renamingId === f.file_id ? (
              <input
                className="rename-input"
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                onBlur={commitRename}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') commitRename();
                  if (e.key === 'Escape') setRenamingId(null);
                }}
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span className="file-title" title={f.title}>
                {f.title}
              </span>
            )}
            <div className="file-actions" onClick={(e) => e.stopPropagation()}>
              <button
                className="file-action-btn"
                onClick={(e) => startRename(e, f)}
                title="Rename"
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </button>
              <button
                className="file-action-btn danger"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(f.file_id);
                }}
                title="Delete"
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="sidebar-footer">
        <button className="btn-sidebar" onClick={onCreateNote}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="12" y1="18" x2="12" y2="12" />
            <line x1="9" y1="15" x2="15" y2="15" />
          </svg>
          New Note
        </button>
        <button
          className="btn-sidebar"
          onClick={() => fileInputRef.current?.click()}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          Upload PDF
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileInput}
          hidden
        />
      </div>
    </aside>
  );
}
