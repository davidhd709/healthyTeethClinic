import type { UserRole } from './jwt';

export type Permission =
  | 'dashboard.view'
  | 'reports.view'
  | 'users.manage'
  | 'services.manage'
  | 'specialists.manage'
  | 'appointments.view'
  | 'appointments.manage'
  | 'calendar.view'
  | 'patients.view'
  | 'patients.manage'
  | 'medicalHistory.view'
  | 'medicalHistory.edit'
  | 'odontogram.view'
  | 'odontogram.edit'
  | 'procedures.view'
  | 'procedures.manage';

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [
    'dashboard.view',
    'reports.view',
    'users.manage',
    'services.manage',
    'specialists.manage',
    'appointments.view',
    'appointments.manage',
    'calendar.view',
    'patients.view',
    'patients.manage',
    'medicalHistory.view',
    'medicalHistory.edit',
    'odontogram.view',
    'odontogram.edit',
    'procedures.view',
    'procedures.manage',
  ],
  specialist: [
    'dashboard.view',
    'appointments.view',
    'calendar.view',
    'patients.view',
    'medicalHistory.view',
    'medicalHistory.edit',
    'odontogram.view',
    'odontogram.edit',
    'procedures.view',
    'procedures.manage',
  ],
  receptionist: [
    'dashboard.view',
    'appointments.view',
    'appointments.manage',
    'calendar.view',
    'patients.view',
    'patients.manage',
    'medicalHistory.view',
    'odontogram.view',
    'procedures.view',
  ],
};

export function hasPermission(role: UserRole | null | undefined, permission: Permission): boolean {
  if (!role) return false;
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function hasAnyPermission(
  role: UserRole | null | undefined,
  permissions: Permission[],
): boolean {
  return permissions.some((p) => hasPermission(role, p));
}

export function getPermissionsForRole(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role] ?? [];
}
