import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';
import { UserRole } from '../../common/types/jwt-payload.type';
import { UsersService } from '../users/users.service';
export declare class AuthService {
    private readonly configService;
    private readonly usersService;
    constructor(configService: ConfigService, usersService: UsersService);
    login(dto: LoginDto): Promise<{
        token: string;
        email: string;
        role: UserRole;
        name: string;
        userId: string;
        expiresAt: string;
    } | {
        token: string;
        email: string;
        role: "admin";
        name: string;
        expiresAt: string;
        userId?: undefined;
    }>;
}
