'use client';

import { useMemo } from 'react';
import { useAuth } from './useAuth';
import {
  hasAnyPermission,
  hasPermission,
  type Permission,
} from '@/lib/permissions';

export function usePermissions() {
  const { user, ready } = useAuth();
  const role = user?.role ?? null;

  return useMemo(
    () => ({
      ready,
      role,
      can: (permission: Permission) => hasPermission(role, permission),
      canAny: (permissions: Permission[]) => hasAnyPermission(role, permissions),
    }),
    [ready, role],
  );
}
