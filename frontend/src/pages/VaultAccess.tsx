import { useState, FormEvent } from 'react';
import { api } from '../api';
import { useTheme } from '../theme';

type Step = 'id' | 'password' | 'confirm-create' | 'accept-terms' | 'set-password';

interface Props {
  onAccess: (vaultId: string, token: string) => void;
  onNavigate: (page: string) => void;
}

export default function VaultAccess({ onAccess, onNavigate }: Props) {
  const [vaultId, setVaultId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState<Step>('id');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const handleCheckVault = async (e: FormEvent) => {
    e.preventDefault();
    const id = vaultId.trim();
    if (!id) { setError('Vault ID is required'); return; }
    setError('');
    setLoading(true);
    try {
      const { exists } = await api.checkVault(id);
      setStep(exists ? 'password' : 'confirm-create');
    } catch (err: any) {
      setError(err.message || 'Failed to check vault');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!password) { setError('Password is required'); return; }
    setError('');
    setLoading(true);
    try {
      const data = await api.loginVault(vaultId.trim(), password);
      onAccess(vaultId.trim(), data.token);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!password) { setError('Password is required'); return; }
    if (password.length < 4) { setError('Password must be at least 4 characters'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match'); return; }
    setError('');
    setLoading(true);
    try {
      const data = await api.createVault(vaultId.trim(), password);
      onAccess(vaultId.trim(), data.token);
    } catch (err: any) {
      setError(err.message || 'Failed to create vault');
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    setError('');
    setPassword('');
    setConfirmPassword('');
    setAcceptedTerms(false);
    setStep('id');
  };

  return (
    <div className="vault-access">
      <button
        className="theme-toggle-float"
        onClick={toggleTheme}
        title="Toggle theme"
      >
        {theme === 'dark' ? '\u2600\uFE0F' : '\uD83C\uDF19'}
      </button>

      <div className="vault-access-card">
        <div className="vault-logo">
          <svg
            viewBox="0 0 24 24"
            width="52"
            height="52"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            <circle cx="12" cy="16" r="1" />
          </svg>
        </div>
        <h1>Student Vault</h1>

        {step === 'id' && (
          <>
            <p className="subtitle">Enter your Vault ID to continue.</p>
            <form onSubmit={handleCheckVault}>
              <div className="field">
                <label htmlFor="vaultId">Vault ID</label>
                <input
                  id="vaultId"
                  type="text"
                  value={vaultId}
                  onChange={(e) => setVaultId(e.target.value)}
                  placeholder="my-secret-vault"
                  autoFocus
                  autoComplete="off"
                />
              </div>
              {error && <div className="form-error">{error}</div>}
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? <span className="spinner" /> : 'Continue'}
              </button>
            </form>
          </>
        )}

        {step === 'password' && (
          <>
            <p className="subtitle">
              Welcome back! Enter the password for <strong>{vaultId.trim()}</strong>.
            </p>
            <form onSubmit={handleLogin}>
              <div className="field">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter vault password"
                  autoFocus
                />
              </div>
              {error && <div className="form-error">{error}</div>}
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? <span className="spinner" /> : 'Unlock Vault'}
              </button>
            </form>
            <button className="btn-link" onClick={goBack}>
              &larr; Use a different Vault ID
            </button>
          </>
        )}

        {step === 'confirm-create' && (
          <>
            <p className="subtitle">
              No vault found with ID <strong>{vaultId.trim()}</strong>.
            </p>
            <div className="confirm-create-box">
              <p>Would you like to create a new vault?</p>
              <div className="confirm-create-actions">
                <button className="btn-primary" onClick={() => setStep('accept-terms')}>
                  Yes, create it
                </button>
                <button className="btn-secondary" onClick={goBack}>
                  No, go back
                </button>
              </div>
            </div>
          </>
        )}

        {step === 'accept-terms' && (
          <>
            <p className="subtitle">
              Before creating your vault, please review and accept our policies.
            </p>
            <div className="terms-accept-box">
              <div className="terms-links">
                <button className="terms-read-link" onClick={() => onNavigate('terms')}>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  Read Terms of Service
                </button>
                <button className="terms-read-link" onClick={() => onNavigate('privacy')}>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  Read Privacy Policy
                </button>
              </div>
              <label className="terms-checkbox">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                />
                <span>
                  I have read and agree to the <strong>Terms of Service</strong> and <strong>Privacy Policy</strong>
                </span>
              </label>
            </div>
            <button
              className="btn-primary"
              disabled={!acceptedTerms}
              onClick={() => setStep('set-password')}
            >
              Continue
            </button>
            <button className="btn-link" onClick={goBack}>
              &larr; Use a different Vault ID
            </button>
          </>
        )}

        {step === 'set-password' && (
          <>
            <p className="subtitle">
              Set a password for your new vault <strong>{vaultId.trim()}</strong>.
            </p>
            <form onSubmit={handleCreate}>
              <div className="field">
                <label htmlFor="newPassword">Password</label>
                <input
                  id="newPassword"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Choose a password (min 4 chars)"
                  autoFocus
                />
              </div>
              <div className="field">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                />
              </div>
              {error && <div className="form-error">{error}</div>}
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? <span className="spinner" /> : 'Create Vault'}
              </button>
            </form>
            <button className="btn-link" onClick={goBack}>
              &larr; Use a different Vault ID
            </button>
          </>
        )}

        <div className="login-footer-links">
          <button className="footer-link" onClick={() => onNavigate('about')}>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            About
          </button>
          <span className="footer-divider">&middot;</span>
          <button className="footer-link" onClick={() => onNavigate('terms')}>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            Terms
          </button>
          <span className="footer-divider">&middot;</span>
          <button className="footer-link" onClick={() => onNavigate('privacy')}>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Privacy
          </button>
        </div>
      </div>
    </div>
  );
}
