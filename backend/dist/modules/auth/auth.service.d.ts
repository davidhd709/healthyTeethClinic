import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private readonly configService;
    constructor(configService: ConfigService);
    login(dto: LoginDto): Promise<{
        token: string;
        email: string;
        role: "admin";
        expiresAt: string;
    }>;
}
