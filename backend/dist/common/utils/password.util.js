"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.verifyPassword = verifyPassword;
const crypto_1 = require("crypto");
const util_1 = require("util");
const scryptAsync = (0, util_1.promisify)(crypto_1.scrypt);
const KEY_LENGTH = 64;
const SALT_LENGTH = 16;
const SCRYPT_N = 16384;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const MAXMEM = 64 * 1024 * 1024;
async function hashPassword(plain) {
    const salt = (0, crypto_1.randomBytes)(SALT_LENGTH);
    const derived = await scryptAsync(plain, salt, KEY_LENGTH, {
        N: SCRYPT_N,
        r: SCRYPT_R,
        p: SCRYPT_P,
        maxmem: MAXMEM,
    });
    return `scrypt$${SCRYPT_N}$${SCRYPT_R}$${SCRYPT_P}$${salt.toString('hex')}$${derived.toString('hex')}`;
}
async function verifyPassword(plain, stored) {
    const parts = stored.split('$');
    if (parts.length !== 6 || parts[0] !== 'scrypt')
        return false;
    const N = Number(parts[1]);
    const r = Number(parts[2]);
    const p = Number(parts[3]);
    const salt = Buffer.from(parts[4], 'hex');
    const expected = Buffer.from(parts[5], 'hex');
    if (!Number.isFinite(N) || !Number.isFinite(r) || !Number.isFinite(p))
        return false;
    if (salt.length === 0 || expected.length === 0)
        return false;
    try {
        const derived = await scryptAsync(plain, salt, expected.length, {
            N,
            r,
            p,
            maxmem: MAXMEM,
        });
        if (derived.length !== expected.length)
            return false;
        return (0, crypto_1.timingSafeEqual)(derived, expected);
    }
    catch {
        return false;
    }
}
//# sourceMappingURL=password.util.js.map