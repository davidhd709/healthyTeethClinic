import { ConfigService } from '@nestjs/config';
import { JwtPayload, UserRole } from '../types/jwt-payload.type';
export declare function getAdminTokenSecret(configService: ConfigService): string;
export declare function getAdminTokenTtlSeconds(configService: ConfigService): number;
export interface GenerateTokenOptions {
    email: string;
    role: UserRole;
    userId?: string;
    secret: string;
    ttlSeconds: number;
}
export declare function generateAdminToken(options: GenerateTokenOptions): {
    token: string;
    expiresAt: string;
};
export declare function verifyAdminToken(token: string, secret: string): JwtPayload | null;
