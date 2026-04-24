"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminTokenSecret = getAdminTokenSecret;
exports.getAdminTokenTtlSeconds = getAdminTokenTtlSeconds;
exports.generateAdminToken = generateAdminToken;
exports.verifyAdminToken = verifyAdminToken;
const crypto_1 = require("crypto");
const jwt_payload_type_1 = require("../types/jwt-payload.type");
const DEFAULT_TOKEN_TTL_SECONDS = 8 * 60 * 60;
function toBase64Url(value) {
    return Buffer.from(value, 'utf-8').toString('base64url');
}
function fromBase64Url(value) {
    return Buffer.from(value, 'base64url').toString('utf-8');
}
function sign(payloadBase64, secret) {
    return (0, crypto_1.createHmac)('sha256', secret).update(payloadBase64).digest('base64url');
}
function safeEqual(a, b) {
    const aBuffer = Buffer.from(a, 'utf-8');
    const bBuffer = Buffer.from(b, 'utf-8');
    if (aBuffer.length !== bBuffer.length)
        return false;
    return (0, crypto_1.timingSafeEqual)(aBuffer, bBuffer);
}
function isValidRole(value) {
    return typeof value === 'string' && jwt_payload_type_1.USER_ROLES.includes(value);
}
function getAdminTokenSecret(configService) {
    const configured = configService.get('ADMIN_TOKEN_SECRET');
    if (configured && configured.trim().length > 0) {
        return configured;
    }
    const adminEmail = configService.get('ADMIN_EMAIL', '');
    const adminPassword = configService.get('ADMIN_PASSWORD', '');
    return `${adminEmail}:${adminPassword}`;
}
function getAdminTokenTtlSeconds(configService) {
    const raw = configService.get('ADMIN_TOKEN_TTL_SECONDS');
    const parsed = raw ? Number(raw) : NaN;
    if (Number.isFinite(parsed) && parsed > 0) {
        return Math.floor(parsed);
    }
    return DEFAULT_TOKEN_TTL_SECONDS;
}
function generateAdminToken(options) {
    const now = Math.floor(Date.now() / 1000);
    const exp = now + options.ttlSeconds;
    const payload = {
        sub: options.email,
        role: options.role,
        userId: options.userId,
        iat: now,
        exp,
    };
    const payloadBase64 = toBase64Url(JSON.stringify(payload));
    const signature = sign(payloadBase64, options.secret);
    return {
        token: `${payloadBase64}.${signature}`,
        expiresAt: new Date(exp * 1000).toISOString(),
    };
}
function verifyAdminToken(token, secret) {
    const [payloadBase64, signature] = token.split('.');
    if (!payloadBase64 || !signature)
        return null;
    const expectedSignature = sign(payloadBase64, secret);
    if (!safeEqual(signature, expectedSignature))
        return null;
    let raw;
    try {
        raw = JSON.parse(fromBase64Url(payloadBase64));
    }
    catch {
        return null;
    }
    if (typeof raw.sub !== 'string' ||
        typeof raw.iat !== 'number' ||
        typeof raw.exp !== 'number') {
        return null;
    }
    const now = Math.floor(Date.now() / 1000);
    if (raw.exp <= now)
        return null;
    const role = isValidRole(raw.role) ? raw.role : 'admin';
    const userId = typeof raw.userId === 'string' ? raw.userId : undefined;
    return {
        sub: raw.sub,
        role,
        userId,
        iat: raw.iat,
        exp: raw.exp,
    };
}
//# sourceMappingURL=admin-token.util.js.map