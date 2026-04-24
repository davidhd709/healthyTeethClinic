import { UserRole } from '../../../common/types/jwt-payload.type';
export declare class QueryUserDto {
    role?: UserRole;
    active?: string;
    search?: string;
}
