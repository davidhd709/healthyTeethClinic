export type UserRole = 'admin' | 'specialist' | 'receptionist';

export interface DecodedToken {
  sub: string;
  role: UserRole;
  userId?: string;
  iat: number;
  exp: number;
}

const VALID_ROLES: readonly UserRole[] = ['admin', 'specialist', 'receptionist'];

function base64UrlDecode(value: string): string {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/');
  const pad = padded.length % 4;
  const full = pad ? padded + '='.repeat(4 - pad) : padded;
  if (typeof atob === 'function') {
    return decodeURIComponent(
      Array.prototype.map
        .call(atob(full), (c: string) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join(''),
    );
  }
  return Buffer.from(full, 'base64').toString('utf-8');
}

export function decodeToken(token: string | null | undefined): DecodedToken | null {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length < 2) return null;

  try {
    const raw = JSON.parse(base64UrlDecode(parts[0])) as Record<string, unknown>;

    if (
      typeof raw.sub !== 'string' ||
      typeof raw.iat !== 'number' ||
      typeof raw.exp !== 'number'
    ) {
      return null;
    }

    const role: UserRole = VALID_ROLES.includes(raw.role as UserRole)
      ? (raw.role as UserRole)
      : 'admin';

    return {
      sub: raw.sub,
      role,
      userId: typeof raw.userId === 'string' ? raw.userId : undefined,
      iat: raw.iat,
      exp: raw.exp,
    };
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string | null | undefined): boolean {
  const decoded = decodeToken(token);
  if (!decoded) return true;
  const nowSeconds = Math.floor(Date.now() / 1000);
  return decoded.exp <= nowSeconds;
}
