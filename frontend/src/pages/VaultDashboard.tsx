import { useState, useEffect, FormEvent } from 'react';
import { useTheme } from '../theme';
import { api, setToken } from '../api';
import QuickPad from '../components/QuickPad';
import StructuredNotes from '../components/StructuredNotes';

type Mode = 'quickpad' | 'structured';

interface Props {
  vaultId: string;
  onLock: () => void;
}

export default function VaultDashboard({ vaultId, onLock }: Props) {
  const { theme, toggleTheme } = useTheme();
  const [mode, setMode] = useState<Mode>(() => {
    return (localStorage.getItem(`sv-mode-${vaultId}`) as Mode) || 'quickpad';
  });
  const [showPwModal, setShowPwModal] = useState(false);

  useEffect(() => {
    localStorage.setItem(`sv-mode-${vaultId}`, mode);
  }, [mode, vaultId]);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span className="vault-name">{vaultId}</span>
        </div>

        <nav className="mode-tabs">
          <button
            className={`tab ${mode === 'quickpad' ? 'active' : ''}`}
            onClick={() => setMode('quickpad')}
          >
            Quick Pad
          </button>
          <button
            className={`tab ${mode === 'structured' ? 'active' : ''}`}
            onClick={() => setMode('structured')}
          >
            Structured Notes
          </button>
        </nav>

        <div className="header-right">
          <button
            className="icon-btn"
            onClick={() => setShowPwModal(true)}
            title="Change password"
          >
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
            </svg>
          </button>
          <button
            className="icon-btn"
            onClick={toggleTheme}
            title="Toggle theme"
          >
            {theme === 'dark' ? '\u2600\uFE0F' : '\uD83C\uDF19'}
          </button>
          <button className="icon-btn lock-btn" onClick={onLock} title="Lock vault">
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        {mode === 'quickpad' ? <QuickPad /> : <StructuredNotes />}
      </main>

      {showPwModal && (
        <ChangePasswordModal onClose={() => setShowPwModal(false)} />
      )}
    </div>
  );
}

function ChangePasswordModal({ onClose }: { onClose: () => void }) {
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!currentPw || !newPw || !confirmPw) {
      setError('All fields are required');
      return;
    }
    if (newPw !== confirmPw) {
      setError('New passwords do not match');
      return;
    }
    if (newPw.length < 4) {
      setError('New password must be at least 4 characters');
      return;
    }

    setLoading(true);
    try {
      const data = await api.changePassword(currentPw, newPw);
      setToken(data.token);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Change Password</h2>
          <button className="modal-close" onClick={onClose}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {success ? (
          <div className="modal-body">
            <div className="success-message">
              <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <p>Password changed successfully!</p>
            </div>
            <button className="btn-primary" onClick={onClose} style={{ marginTop: 16 }}>
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="modal-body">
            <div className="field">
              <label htmlFor="currentPw">Current Password</label>
              <input
                id="currentPw"
                type="password"
                value={currentPw}
                onChange={(e) => setCurrentPw(e.target.value)}
                placeholder="Enter current password"
                autoFocus
              />
            </div>
            <div className="field">
              <label htmlFor="newPw">New Password</label>
              <input
                id="newPw"
                type="password"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                placeholder="Enter new password"
              />
            </div>
            <div className="field">
              <label htmlFor="confirmPw">Confirm New Password</label>
              <input
                id="confirmPw"
                type="password"
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                placeholder="Re-enter new password"
              />
            </div>
            {error && <div className="form-error">{error}</div>}
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? <span className="spinner" /> : 'Change Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
