import { useState, useEffect, useRef, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { api } from '../api';
import { useTheme } from '../theme';

export default function QuickPad() {
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [copied, setCopied] = useState(false);
  const { theme } = useTheme();
  const saveTimer = useRef<ReturnType<typeof setTimeout>>();
  const contentRef = useRef(content);

  useEffect(() => {
    api.getQuickPad().then((data) => {
      setContent(data.content || '');
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    contentRef.current = content;
  }, [content]);

  const save = useCallback(async (text: string) => {
    setSaving(true);
    try {
      await api.saveQuickPad(text);
    } finally {
      setSaving(false);
    }
  }, []);

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

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!loaded) {
    return <div className="center-loader">Loading Quick Pad...</div>;
  }

  return (
    <div className="quickpad">
      <div className="quickpad-toolbar">
        <span className={`save-indicator ${saving ? 'saving' : 'saved'}`}>
          {saving ? 'Saving...' : 'Saved'}
        </span>
        <button className="btn-sm" onClick={handleCopy}>
          {copied ? '\u2713 Copied' : 'Copy All'}
        </button>
      </div>
      <div className="quickpad-editor">
        <Editor
          height="100%"
          defaultLanguage="plaintext"
          value={content}
          onChange={handleChange}
          theme={theme === 'dark' ? 'vs-dark' : 'light'}
          options={{
            fontSize: 14,
            fontFamily: "'Cascadia Code', 'Fira Code', 'JetBrains Mono', Consolas, monospace",
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
