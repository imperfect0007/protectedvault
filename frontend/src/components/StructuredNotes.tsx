import { useState, useEffect, useCallback } from 'react';
import { api } from '../api';
import { VaultFile } from '../types';
import Sidebar from './Sidebar';
import NoteEditor from './NoteEditor';
import PDFViewer from './PDFViewer';

export default function StructuredNotes() {
  const [files, setFiles] = useState<VaultFile[]>([]);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [activeFile, setActiveFile] = useState<VaultFile | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const loadFiles = useCallback(async () => {
    const data = await api.getFiles();
    setFiles(data.files);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  useEffect(() => {
    if (!activeFileId) {
      setActiveFile(null);
      return;
    }
    api.getFile(activeFileId).then((data) => setActiveFile(data.file));
  }, [activeFileId]);

  const getNextNoteName = () => {
    const existing = files
      .filter((f) => f.type === 'note')
      .map((f) => f.title);

    let n = 1;
    while (existing.includes(`Note-${n}`)) n++;
    return `Note-${n}`;
  };

  const handleCreateNote = async () => {
    const data = await api.createNote(getNextNoteName());
    await loadFiles();
    setActiveFileId(data.file.file_id);
  };

  const getUniquePDFName = (name: string) => {
    const existing = files.map((f) => f.title);
    if (!existing.includes(name)) return name;

    const dot = name.lastIndexOf('.');
    const base = dot > 0 ? name.slice(0, dot) : name;
    const ext = dot > 0 ? name.slice(dot) : '';

    let n = 1;
    while (existing.includes(`${base}-${n}${ext}`)) n++;
    return `${base}-${n}${ext}`;
  };

  const handleUploadPDF = async (file: File) => {
    setUploading(true);
    try {
      const title = getUniquePDFName(file.name);
      const data = await api.uploadPDF(file, title);
      await loadFiles();
      setActiveFileId(data.file.file_id);
    } finally {
      setUploading(false);
    }
  };

  const handleRename = async (fileId: string, title: string) => {
    await api.updateFile(fileId, { title });
    await loadFiles();
    if (activeFile && activeFile.file_id === fileId) {
      setActiveFile((prev) => (prev ? { ...prev, title } : null));
    }
  };

  const handleDelete = async (fileId: string) => {
    await api.deleteFile(fileId);
    if (activeFileId === fileId) setActiveFileId(null);
    await loadFiles();
  };

  const handleSaveNote = useCallback(
    async (content: string) => {
      if (!activeFileId) return;
      await api.updateFile(activeFileId, { content });
    },
    [activeFileId]
  );

  if (loading) {
    return <div className="center-loader">Loading files...</div>;
  }

  return (
    <div className="structured">
      <Sidebar
        files={files}
        activeFileId={activeFileId}
        onSelect={setActiveFileId}
        onCreateNote={handleCreateNote}
        onUploadPDF={handleUploadPDF}
        onRename={handleRename}
        onDelete={handleDelete}
      />
      <div className="structured-main">
        {uploading && (
          <div className="upload-overlay">
            <div className="spinner" />
            <span>Uploading & compressing PDF...</span>
          </div>
        )}
        {!activeFile ? (
          <div className="empty-state">
            <svg
              viewBox="0 0 24 24"
              width="48"
              height="48"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              opacity="0.3"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            <p>Select a file or create a new one</p>
          </div>
        ) : activeFile.type === 'note' ? (
          <NoteEditor file={activeFile} onSave={handleSaveNote} />
        ) : (
          <PDFViewer file={activeFile} />
        )}
      </div>
    </div>
  );
}
