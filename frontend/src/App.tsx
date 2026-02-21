import { useState, useEffect, lazy, Suspense } from 'react';
import { ThemeProvider } from './theme';
import { getToken, setToken } from './api';
import VaultAccess from './pages/VaultAccess';

const VaultDashboard = lazy(() => import('./pages/VaultDashboard'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));

type Page = 'login' | 'dashboard' | 'about' | 'privacy' | 'terms';

export default function App() {
  const [page, setPage] = useState<Page>('login');
  const [vaultId, setVaultId] = useState('');

  useEffect(() => {
    const t = getToken();
    const saved = sessionStorage.getItem('sv_vault_id');
    if (t && saved) {
      setPage('dashboard');
      setVaultId(saved);
    }
  }, []);

  const handleAccess = (id: string, token: string) => {
    setToken(token);
    sessionStorage.setItem('sv_vault_id', id);
    setVaultId(id);
    setPage('dashboard');
  };

  const handleLock = () => {
    setToken(null);
    sessionStorage.removeItem('sv_vault_id');
    setPage('login');
    setVaultId('');
  };

  const fallback = (
    <div className="center-loader" style={{ minHeight: '100vh' }}>
      Loading…
    </div>
  );

  return (
    <ThemeProvider>
      {page === 'login' && (
        <VaultAccess
          onAccess={handleAccess}
          onNavigate={(p) => setPage(p as Page)}
        />
      )}
      {page !== 'login' && (
        <Suspense fallback={fallback}>
          {page === 'dashboard' && (
            <VaultDashboard vaultId={vaultId} onLock={handleLock} />
          )}
          {page === 'about' && <AboutPage onBack={() => setPage('login')} />}
          {page === 'privacy' && <PrivacyPolicy onBack={() => setPage('login')} />}
          {page === 'terms' && <TermsOfService onBack={() => setPage('login')} />}
        </Suspense>
      )}
    </ThemeProvider>
  );
}
