import { useState, useEffect } from 'react';
import { ThemeProvider } from './theme';
import { getToken, setToken } from './api';
import VaultAccess from './pages/VaultAccess';
import VaultDashboard from './pages/VaultDashboard';
import AboutPage from './pages/AboutPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';

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

  return (
    <ThemeProvider>
      {page === 'dashboard' && (
        <VaultDashboard vaultId={vaultId} onLock={handleLock} />
      )}
      {page === 'login' && (
        <VaultAccess
          onAccess={handleAccess}
          onNavigate={(p) => setPage(p as Page)}
        />
      )}
      {page === 'about' && (
        <AboutPage onBack={() => setPage('login')} />
      )}
      {page === 'privacy' && (
        <PrivacyPolicy onBack={() => setPage('login')} />
      )}
      {page === 'terms' && (
        <TermsOfService onBack={() => setPage('login')} />
      )}
    </ThemeProvider>
  );
}
