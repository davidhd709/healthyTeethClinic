import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthenticatedUser } from '../../common/types/jwt-payload.type';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(dto: LoginDto): Promise<{
        token: string;
        email: string;
        role: "admin";
        expiresAt: string;
    }>;
    me(user: AuthenticatedUser): AuthenticatedUser;
}
