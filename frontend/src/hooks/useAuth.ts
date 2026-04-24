'use client';

import { useCallback, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import { decodeToken, isTokenExpired, type DecodedToken, type UserRole } from '@/lib/jwt';

const TOKEN_KEY = 'admin_token';
const TOKEN_CHANGED_EVENT = 'admin_token_changed';

export interface AuthUser {
  email: string;
  role: UserRole;
  userId?: string;
}

function readToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

function subscribe(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => undefined;
  window.addEventListener('storage', callback);
  window.addEventListener(TOKEN_CHANGED_EVENT, callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener(TOKEN_CHANGED_EVENT, callback);
  };
}

function getSnapshot(): string | null {
  return readToken();
}

function getServerSnapshot(): string | null {
  return null;
}

function tokenToUser(token: string | null): AuthUser | null {
  if (!token || isTokenExpired(token)) return null;
  const decoded: DecodedToken | null = decodeToken(token);
  if (!decoded) return null;
  return {
    email: decoded.sub,
    role: decoded.role,
    userId: decoded.userId,
  };
}

export function useAuth() {
  const router = useRouter();
  const token = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const user = tokenToUser(token);
  const ready = typeof window !== 'undefined';

  const logout = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(TOKEN_KEY);
      window.dispatchEvent(new Event(TOKEN_CHANGED_EVENT));
    }
    router.push('/admin/login');
  }, [router]);

  const setToken = useCallback((value: string) => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(TOKEN_KEY, value);
    window.dispatchEvent(new Event(TOKEN_CHANGED_EVENT));
  }, []);

  return {
    user,
    ready,
    isAuthenticated: !!user,
    logout,
    setToken,
  };
}
