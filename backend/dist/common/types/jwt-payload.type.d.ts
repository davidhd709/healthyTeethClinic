export type UserRole = 'admin' | 'specialist' | 'receptionist';
export declare const USER_ROLES: readonly UserRole[];
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
