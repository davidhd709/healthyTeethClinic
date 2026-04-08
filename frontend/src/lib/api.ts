const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export function apiUrl(path: string): string {
  return `${API_URL}${path}`;
}

export async function apiFetch<T = unknown>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(apiUrl(path), {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Error del servidor' }));
    throw new Error(err.message || err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export function authHeaders(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}
