import { createHmac, timingSafeEqual } from 'crypto';
import { ConfigService } from '@nestjs/config';

interface AdminTokenPayload {
  sub: string;
  iat: number;
  exp: number;
}

const DEFAULT_TOKEN_TTL_SECONDS = 8 * 60 * 60;

function toBase64Url(value: string): string {
  return Buffer.from(value, 'utf-8').toString('base64url');
}

function fromBase64Url(value: string): string {
  return Buffer.from(value, 'base64url').toString('utf-8');
}

function sign(payloadBase64: string, secret: string): string {
  return createHmac('sha256', secret).update(payloadBase64).digest('base64url');
}

function safeEqual(a: string, b: string): boolean {
  const aBuffer = Buffer.from(a, 'utf-8');
  const bBuffer = Buffer.from(b, 'utf-8');
  if (aBuffer.length !== bBuffer.length) return false;
  return timingSafeEqual(aBuffer, bBuffer);
}

export function getAdminTokenSecret(configService: ConfigService): string {
  const configured = configService.get<string>('ADMIN_TOKEN_SECRET');
  if (configured && configured.trim().length > 0) {
    return configured;
  }

  const adminEmail = configService.get<string>('ADMIN_EMAIL', '');
  const adminPassword = configService.get<string>('ADMIN_PASSWORD', '');
  return `${adminEmail}:${adminPassword}`;
}

export function getAdminTokenTtlSeconds(configService: ConfigService): number {
  const raw = configService.get<string>('ADMIN_TOKEN_TTL_SECONDS');
  const parsed = raw ? Number(raw) : NaN;
  if (Number.isFinite(parsed) && parsed > 0) {
    return Math.floor(parsed);
  }
  return DEFAULT_TOKEN_TTL_SECONDS;
}

export function generateAdminToken(
  email: string,
  secret: string,
  ttlSeconds: number,
): { token: string; expiresAt: string } {
  const now = Math.floor(Date.now() / 1000);
  const exp = now + ttlSeconds;
  const payload: AdminTokenPayload = {
    sub: email,
    iat: now,
    exp,
  };

  const payloadBase64 = toBase64Url(JSON.stringify(payload));
  const signature = sign(payloadBase64, secret);

  return {
    token: `${payloadBase64}.${signature}`,
    expiresAt: new Date(exp * 1000).toISOString(),
  };
}

export function verifyAdminToken(
  token: string,
  secret: string,
): AdminTokenPayload | null {
  const [payloadBase64, signature] = token.split('.');
  if (!payloadBase64 || !signature) return null;

  const expectedSignature = sign(payloadBase64, secret);
  if (!safeEqual(signature, expectedSignature)) return null;

  let payload: AdminTokenPayload;
  try {
    payload = JSON.parse(fromBase64Url(payloadBase64)) as AdminTokenPayload;
  } catch {
    return null;
  }

  if (
    typeof payload.sub !== 'string' ||
    typeof payload.iat !== 'number' ||
    typeof payload.exp !== 'number'
  ) {
    return null;
  }

  const now = Math.floor(Date.now() / 1000);
  if (payload.exp <= now) return null;

  return payload;
}
