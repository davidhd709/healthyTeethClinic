import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthenticatedUser } from '../../common/types/jwt-payload.type';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(dto: LoginDto): Promise<{
        token: string;
        email: string;
        role: import("../../common/types/jwt-payload.type").UserRole;
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
    me(user: AuthenticatedUser): AuthenticatedUser;
}
