import { useTheme } from '../theme';

interface Props {
  onBack: () => void;
}

export default function TermsOfService({ onBack }: Props) {
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
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
          <h1>Terms of Service</h1>
          <p className="info-tagline">Please read these terms carefully before using ProtectedVault</p>
        </div>

        <p className="info-intro">
          By accessing or using ProtectedVault, you agree to be bound by
          these Terms of Service. If you do not agree to these terms, you
          must not use this service.
        </p>

        {/* 1. Acceptance of Terms */}
        <div className="info-section">
          <div className="info-section-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
            </svg>
          </div>
          <div>
            <h2>1. Acceptance of Terms</h2>
            <p>
              By creating a vault or accessing any content through ProtectedVault,
              you acknowledge that you have read, understood, and agree to be bound
              by these Terms of Service. These terms apply to all users of the service
              without exception.
            </p>
          </div>
        </div>

        {/* 2. User Responsibility for Content */}
        <div className="info-section">
          <div className="info-section-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div>
            <h2>2. User Responsibility for Content</h2>
            <p>
              You are solely and entirely responsible for all content that you
              upload, store, create, or share within your vault. This includes but
              is not limited to:
            </p>
            <ul>
              <li>Notes, text, and code snippets</li>
              <li>Uploaded PDF files and documents</li>
              <li>Quick Pad entries</li>
              <li>Any other data stored within your vault</li>
            </ul>
            <p>
              ProtectedVault acts only as a storage platform. We do not review,
              endorse, or take ownership of any user-generated content. You bear
              full responsibility for ensuring that your content complies with all
              applicable laws and regulations.
            </p>
          </div>
        </div>

        {/* 3. Prohibited Use */}
        <div className="info-section">
          <div className="info-section-icon tos-danger-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
            </svg>
          </div>
          <div>
            <h2>3. Prohibited Use</h2>
            <p>
              You agree <strong>not</strong> to use ProtectedVault for any of the
              following purposes:
            </p>
            <ul>
              <li>Storing, distributing, or facilitating any illegal content or activities</li>
              <li>Uploading malware, viruses, or any harmful software</li>
              <li>Hosting content that promotes violence, hate speech, or harassment</li>
              <li>Engaging in any activity that violates local, national, or international law</li>
              <li>Attempting to exploit, hack, or disrupt the service or its infrastructure</li>
              <li>Using the service to spam, phish, or conduct fraudulent activities</li>
            </ul>
            <p>
              Any vault found to be in violation of these terms may be permanently
              removed without prior notice.
            </p>
          </div>
        </div>

        {/* 4. Copyright & Intellectual Property */}
        <div className="info-section">
          <div className="info-section-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><path d="M14.83 14.83a4 4 0 11-5.66-5.66 4 4 0 015.66 5.66z" />
            </svg>
          </div>
          <div>
            <h2>4. Copyright &amp; Intellectual Property</h2>
            <p>
              You must not upload, store, or distribute any content that infringes
              upon the copyright, trademark, or other intellectual property rights of
              any third party. This includes but is not limited to:
            </p>
            <ul>
              <li>Pirated textbooks, books, or publications</li>
              <li>Copyrighted software or code without proper licensing</li>
              <li>Proprietary materials belonging to educational institutions without authorization</li>
              <li>Any content you do not have the legal right to store or distribute</li>
            </ul>
            <p>
              If we receive a valid copyright complaint regarding content stored in a
              vault, we reserve the right to remove such content and/or terminate the
              associated vault.
            </p>
          </div>
        </div>

        {/* 5. Limitation of Liability */}
        <div className="info-section">
          <div className="info-section-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div>
            <h2>5. Limitation of Liability</h2>
            <p>
              ProtectedVault is provided on an <strong>"as is"</strong> and
              <strong>"as available"</strong> basis. To the fullest extent permitted
              by law:
            </p>
            <ul>
              <li>We make no warranties or guarantees regarding uptime, availability, or data integrity</li>
              <li>We are not liable for any data loss, corruption, or unauthorized access to your vault</li>
              <li>We are not responsible for any damages — direct, indirect, incidental, or consequential — arising from your use of the service</li>
              <li>We are not liable for any content stored by users or any consequences resulting from such content</li>
              <li>We do not guarantee that the service will be uninterrupted, error-free, or secure at all times</li>
            </ul>
            <p>
              You use ProtectedVault at your own risk. It is your responsibility to
              maintain backups of any important data stored in your vault.
            </p>
          </div>
        </div>

        {/* 6. Right to Remove Data */}
        <div className="info-section">
          <div className="info-section-icon tos-danger-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" /><path d="M19 6l-2 14H7L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" />
            </svg>
          </div>
          <div>
            <h2>6. Right to Remove Data &amp; Terminate Access</h2>
            <p>
              We reserve the right, at our sole discretion, to:
            </p>
            <ul>
              <li>Remove any vault or content that violates these terms</li>
              <li>Delete vaults that have been inactive for an extended period</li>
              <li>Suspend or terminate access to the service for any user at any time</li>
              <li>Modify or discontinue the service (or any part of it) without prior notice</li>
            </ul>
            <p>
              We are under no obligation to store, maintain, or provide access to any
              content indefinitely.
            </p>
          </div>
        </div>

        {/* 7. No Account Recovery */}
        <div className="info-section">
          <div className="info-section-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <div>
            <h2>7. No Account Recovery</h2>
            <p>
              Since ProtectedVault does not collect personal information such as email
              addresses, there is no password recovery mechanism. If you lose your
              Vault ID or password, access to your vault cannot be restored. You are
              solely responsible for safeguarding your credentials.
            </p>
          </div>
        </div>

        {/* 8. Service Modifications */}
        <div className="info-section">
          <div className="info-section-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
            </svg>
          </div>
          <div>
            <h2>8. Changes to These Terms</h2>
            <p>
              We may update these Terms of Service at any time. Continued use of
              ProtectedVault after any changes constitutes your acceptance of the
              revised terms. It is your responsibility to review these terms
              periodically.
            </p>
          </div>
        </div>

        <div className="info-footer-note">
          <p>
            By using ProtectedVault, you confirm that you have read and agree to
            these Terms of Service. If you do not agree, please discontinue use
            of the service immediately.
          </p>
        </div>
      </div>
    </div>
  );
}
