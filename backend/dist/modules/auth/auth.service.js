"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const admin_token_util_1 = require("../../common/utils/admin-token.util");
const users_service_1 = require("../users/users.service");
const password_util_1 = require("../../common/utils/password.util");
let AuthService = class AuthService {
    constructor(configService, usersService) {
        this.configService = configService;
        this.usersService = usersService;
    }
    async login(dto) {
        const email = dto.email.toLowerCase().trim();
        const secret = (0, admin_token_util_1.getAdminTokenSecret)(this.configService);
        const ttlSeconds = (0, admin_token_util_1.getAdminTokenTtlSeconds)(this.configService);
        const dbUser = await this.usersService.findByEmailWithPassword(email);
        if (dbUser) {
            const ok = await (0, password_util_1.verifyPassword)(dto.password, dbUser.passwordHash);
            if (!ok) {
                throw new common_1.UnauthorizedException('Credenciales inválidas');
            }
            const userId = String(dbUser._id);
            await this.usersService.touchLastLogin(userId);
            const { token, expiresAt } = (0, admin_token_util_1.generateAdminToken)({
                email: dbUser.email,
                role: dbUser.role,
                userId,
                secret,
                ttlSeconds,
            });
            return {
                token,
                email: dbUser.email,
                role: dbUser.role,
                name: dbUser.name,
                userId,
                expiresAt,
            };
        }
        const adminEmail = this.configService.get('ADMIN_EMAIL');
        const adminPassword = this.configService.get('ADMIN_PASSWORD');
        if (adminEmail && adminPassword && email === adminEmail && dto.password === adminPassword) {
            const role = 'admin';
            const { token, expiresAt } = (0, admin_token_util_1.generateAdminToken)({
                email,
                role,
                secret,
                ttlSeconds,
            });
            return {
                token,
                email,
                role,
                name: 'Administrador',
                expiresAt,
            };
        }
        throw new common_1.UnauthorizedException('Credenciales inválidas');
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        users_service_1.UsersService])
], AuthService);
//# sourceMappingURL=auth.service.js.map