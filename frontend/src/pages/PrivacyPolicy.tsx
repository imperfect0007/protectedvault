import { useTheme } from '../theme';

interface Props {
  onBack: () => void;
}

export default function PrivacyPolicy({ onBack }: Props) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="info-page">
      <button
        className="theme-toggle-float"
        onClick={toggleTheme}
        title="Toggle theme"
      >
        {theme === 'dark' ? '\u2600\uFE0F' : '\uD83C\uDF19'}
      </button>

      <div className="info-page-card">
        <button className="info-back-btn" onClick={onBack}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" /><polyline points="12 19 5 12 12 5" />
          </svg>
          Back
        </button>

        <div className="info-hero">
          <div className="info-hero-icon">
            <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <h1>Privacy Policy</h1>
          <p className="info-tagline">How ProtectedVault handles your data</p>
        </div>

        <p className="info-intro">
          ProtectedVault is built with privacy at its core. We believe productivity
          tools should serve you without compromising your personal information.
        </p>

        <div className="info-section">
          <div className="info-section-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div>
            <h2>No Personal Information Collected</h2>
            <p>
              ProtectedVault does not require an email address, phone number, name,
              or any personally identifiable information. Access is granted purely
              through a Vault ID and password that you choose.
            </p>
          </div>
        </div>

        <div className="info-section">
          <div className="info-section-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <div>
            <h2>Password Security</h2>
            <p>
              Your vault password is never stored in plain text. All passwords are
              hashed using <strong>bcrypt</strong> with a high cost factor before
              being stored, making them resistant to brute-force attacks. We never
              have access to your actual password.
            </p>
          </div>
        </div>

        <div className="info-section">
          <div className="info-section-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          <div>
            <h2>Data Storage</h2>
            <p>
              All vault data — notes, quick pad content, and uploaded PDFs — is stored
              securely in the cloud using Supabase infrastructure. Your data is
              associated only with your Vault ID, not with any personal identity.
            </p>
          </div>
        </div>

        <div className="info-section">
          <div className="info-section-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
            </svg>
          </div>
          <div>
            <h2>No Tracking or Analytics</h2>
            <p>
              ProtectedVault does not use cookies for tracking, does not embed
              third-party analytics, and does not monitor user behavior.
              Your usage of the vault is your business.
            </p>
          </div>
        </div>

        <div className="info-section">
          <div className="info-section-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <div>
            <h2>Session Management</h2>
            <p>
              Authentication is handled using short-lived JWT tokens stored in your
              browser's session storage. Tokens are automatically cleared when you
              close the browser tab or lock your vault. No persistent login cookies
              are used.
            </p>
          </div>
        </div>

        <div className="info-section">
          <div className="info-section-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" /><path d="M19 6l-2 14H7L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" />
            </svg>
          </div>
          <div>
            <h2>Data Deletion</h2>
            <p>
              Your vault and all its contents can be managed entirely by you. Since
              no personal information is tied to your vault, deleting your vault
              removes all associated data permanently.
            </p>
          </div>
        </div>

        <div className="info-section">
          <div className="info-section-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <div>
            <h2>PDF Handling</h2>
            <p>
              Uploaded PDFs are compressed server-side to reduce storage and improve
              load times. Only the compressed version is stored. Original files are
              not retained after processing.
            </p>
          </div>
        </div>

        <div className="info-footer-note">
          <p>
            This policy may be updated as the application evolves. Continued use
            of ProtectedVault constitutes acceptance of any changes.
          </p>
        </div>
      </div>
    </div>
  );
}
