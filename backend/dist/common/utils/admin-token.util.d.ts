import { ConfigService } from '@nestjs/config';
interface AdminTokenPayload {
    sub: string;
    iat: number;
    exp: number;
}
export declare function getAdminTokenSecret(configService: ConfigService): string;
export declare function getAdminTokenTtlSeconds(configService: ConfigService): number;
export declare function generateAdminToken(email: string, secret: string, ttlSeconds: number): {
    token: string;
    expiresAt: string;
};
export declare function verifyAdminToken(token: string, secret: string): AdminTokenPayload | null;
export {};
