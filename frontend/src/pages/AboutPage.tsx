import { useTheme } from '../theme';

interface Props {
  onBack: () => void;
}

export default function AboutPage({ onBack }: Props) {
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
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              <circle cx="12" cy="16" r="1" />
            </svg>
          </div>
          <h1>ProtectedVault</h1>
          <p className="info-tagline">A Simple Vault for Your Academic Work</p>
        </div>

        <p className="info-intro">
          ProtectedVault is designed to help students store and access their notes,
          lab programs, and files without unnecessary complexity.
        </p>

        <div className="info-highlights">
          <span>No accounts.</span>
          <span>No lengthy sign-ups.</span>
          <span>No distractions.</span>
        </div>

        <p className="info-callout">Just a vault, an ID, and a password.</p>

        <div className="info-section">
          <div className="info-section-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <div>
            <h2>Vault-Based Access</h2>
            <p>ProtectedVault works using a simple vault system. Enter a Vault ID and a Password.</p>
            <ul>
              <li>If the vault exists, it opens.</li>
              <li>If it doesn't, it is created instantly.</li>
            </ul>
            <p>There is no registration process.</p>
          </div>
        </div>

        <div className="info-section">
          <div className="info-section-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
          </div>
          <div>
            <h2>Quick Pad Mode</h2>
            <p>Quick Pad provides a distraction-free editor for:</p>
            <ul>
              <li>Lab programs</li>
              <li>Commands</li>
              <li>Quick notes</li>
              <li>Code snippets</li>
            </ul>
            <p>Everything auto-saves, so you never lose your work.</p>
          </div>
        </div>

        <div className="info-section">
          <div className="info-section-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
            </svg>
          </div>
          <div>
            <h2>Structured Notes Mode</h2>
            <p>Structured Mode helps you stay organized. Create multiple:</p>
            <ul>
              <li>Notes</li>
              <li>PDFs</li>
            </ul>
            <p>Perfect for managing subjects, labs, and semester materials.</p>
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
            <h2>Built-In PDF Viewing</h2>
            <p>Uploaded PDFs can be viewed directly inside your vault. No downloads required. This allows faster access to:</p>
            <ul>
              <li>Lab manuals</li>
              <li>Assignments</li>
              <li>Reference materials</li>
            </ul>
          </div>
        </div>

        <div className="info-section">
          <div className="info-section-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
          <div>
            <h2>Fast &amp; Lightweight</h2>
            <p>ProtectedVault is built to be fast, minimal, and easy to use. Because productivity tools should not slow you down.</p>
          </div>
        </div>

        <div className="info-section">
          <div className="info-section-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div>
            <h2>Privacy-Focused Design</h2>
            <p>
              ProtectedVault does not require personal information. Vaults are
              protected using password-based access, ensuring users remain in
              control of their data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
