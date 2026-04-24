export type UserRole = 'admin' | 'specialist' | 'receptionist';

export const USER_ROLES: readonly UserRole[] = ['admin', 'specialist', 'receptionist'] as const;

export interface JwtPayload {
  sub: string;
  role: UserRole;
  userId?: string;
  iat: number;
  exp: number;
}

export interface AuthenticatedUser {
  email: string;
  role: UserRole;
  userId?: string;
}
