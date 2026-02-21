const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/api\/?$/, '').replace(/\/$/, '') + '/api';

let token: string | null = null;

export function setToken(t: string | null) {
  token = t;
  if (t) sessionStorage.setItem('sv_token', t);
  else sessionStorage.removeItem('sv_token');
}

export function getToken(): string | null {
  if (!token) token = sessionStorage.getItem('sv_token');
  return token;
}

async function request(path: string, options: RequestInit = {}) {
  const headers: Record<string, string> = {
    ...((options.headers as Record<string, string>) || {}),
  };

  const t = getToken();
  if (t) headers['Authorization'] = `Bearer ${t}`;

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || 'Request failed');
  }

  return res.json();
}

export const api = {
  checkVault: (vaultId: string) =>
    request('/vault/check', {
      method: 'POST',
      body: JSON.stringify({ vaultId }),
    }),

  loginVault: (vaultId: string, password: string) =>
    request('/vault/login', {
      method: 'POST',
      body: JSON.stringify({ vaultId, password }),
    }),

  createVault: (vaultId: string, password: string) =>
    request('/vault/create', {
      method: 'POST',
      body: JSON.stringify({ vaultId, password }),
    }),

  getQuickPad: () => request('/quickpad'),

  saveQuickPad: (content: string) =>
    request('/quickpad', {
      method: 'PUT',
      body: JSON.stringify({ content }),
    }),

  getFiles: () => request('/files'),

  createNote: (title: string) =>
    request('/files/note', {
      method: 'POST',
      body: JSON.stringify({ title }),
    }),

  uploadPDF: (file: File, title?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    if (title) formData.append('title', title);
    return request('/files/pdf', { method: 'POST', body: formData });
  },

  getFile: (fileId: string) => request(`/files/${fileId}`),

  updateFile: (fileId: string, data: { title?: string; content?: string }) =>
    request(`/files/${fileId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteFile: (fileId: string) =>
    request(`/files/${fileId}`, { method: 'DELETE' }),

  changePassword: (currentPassword: string, newPassword: string) =>
    request('/vault/change-password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    }),

  getPDFUrl: (fileId: string) => {
    const t = getToken();
    return `${API_BASE}/files/${fileId}/pdf?token=${t}`;
  },
};
