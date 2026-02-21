import { useState, useEffect, useRef, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { VaultFile } from '../types';
import { useTheme } from '../theme';

interface Props {
  file: VaultFile;
  onSave: (content: string) => Promise<void>;
}

export default function NoteEditor({ file, onSave }: Props) {
  const [content, setContent] = useState(file.content || '');
  const [saving, setSaving] = useState(false);
  const { theme } = useTheme();
  const saveTimer = useRef<ReturnType<typeof setTimeout>>();
  const contentRef = useRef(content);

  useEffect(() => {
    setContent(file.content || '');
  }, [file.file_id, file.content]);

  useEffect(() => {
    contentRef.current = content;
  }, [content]);

  const save = useCallback(
    async (text: string) => {
      setSaving(true);
      try {
        await onSave(text);
      } finally {
        setSaving(false);
      }
    },
    [onSave]
  );

  const handleChange = (value: string | undefined) => {
    const v = value ?? '';
    setContent(v);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => save(v), 800);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (saveTimer.current) clearTimeout(saveTimer.current);
        save(contentRef.current);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [save]);

  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(contentRef.current);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleManualSave = () => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    save(contentRef.current);
  };

  return (
    <div className="note-editor">
      <div className="note-editor-header">
        <h3>{file.title}</h3>
        <div className="note-editor-actions">
          <span className={`save-indicator ${saving ? 'saving' : 'saved'}`}>
            {saving ? 'Saving...' : 'Saved'}
          </span>
          <button className="btn-sm" onClick={handleManualSave} title="Save now (Ctrl+S)">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
            Save
          </button>
          <button className="btn-sm" onClick={handleCopy}>
            {copied ? '\u2713 Copied' : 'Copy'}
          </button>
        </div>
      </div>
      <div className="note-editor-body">
        <Editor
          height="100%"
          defaultLanguage="plaintext"
          value={content}
          onChange={handleChange}
          theme={theme === 'dark' ? 'vs-dark' : 'light'}
          options={{
            fontSize: 14,
            fontFamily:
              "'Cascadia Code', 'Fira Code', 'JetBrains Mono', Consolas, monospace",
            minimap: { enabled: false },
            wordWrap: 'on',
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            padding: { top: 16, bottom: 16 },
            automaticLayout: true,
            renderLineHighlight: 'gutter',
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
          }}
        />
      </div>
    </div>
  );
}
