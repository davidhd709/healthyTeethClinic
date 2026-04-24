'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { decodeToken, isTokenExpired, type DecodedToken, type UserRole } from '@/lib/jwt';

const TOKEN_KEY = 'admin_token';
const TOKEN_CHANGED_EVENT = 'admin_token_changed';

export interface AuthUser {
  email: string;
  role: UserRole;
  userId?: string;
}

function readAuthUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  const token = window.localStorage.getItem(TOKEN_KEY);
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
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setUser(readAuthUser());
    setReady(true);

    function handleChange() {
      setUser(readAuthUser());
    }

    window.addEventListener('storage', handleChange);
    window.addEventListener(TOKEN_CHANGED_EVENT, handleChange);

    return () => {
      window.removeEventListener('storage', handleChange);
      window.removeEventListener(TOKEN_CHANGED_EVENT, handleChange);
    };
  }, []);

  const logout = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(TOKEN_KEY);
      window.dispatchEvent(new Event(TOKEN_CHANGED_EVENT));
    }
    setUser(null);
    router.push('/admin/login');
  }, [router]);

  const setToken = useCallback((token: string) => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(TOKEN_KEY, token);
    window.dispatchEvent(new Event(TOKEN_CHANGED_EVENT));
    setUser(readAuthUser());
  }, []);

  return {
    user,
    ready,
    isAuthenticated: !!user,
    logout,
    setToken,
  };
}
