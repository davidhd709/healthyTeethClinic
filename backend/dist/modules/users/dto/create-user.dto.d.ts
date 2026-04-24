import { UserRole } from '../../../common/types/jwt-payload.type';
export declare class CreateUserDto {
    email: string;
    password: string;
    name: string;
    role: UserRole;
    specialistId?: string;
    isActive?: boolean;
}
