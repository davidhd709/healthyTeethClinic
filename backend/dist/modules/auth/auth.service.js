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
let AuthService = class AuthService {
    constructor(configService) {
        this.configService = configService;
    }
    async login(dto) {
        const adminEmail = this.configService.get('ADMIN_EMAIL');
        const adminPassword = this.configService.get('ADMIN_PASSWORD');
        if (dto.email !== adminEmail || dto.password !== adminPassword) {
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        }
        const role = 'admin';
        const secret = (0, admin_token_util_1.getAdminTokenSecret)(this.configService);
        const ttlSeconds = (0, admin_token_util_1.getAdminTokenTtlSeconds)(this.configService);
        const { token, expiresAt } = (0, admin_token_util_1.generateAdminToken)({
            email: dto.email,
            role,
            secret,
            ttlSeconds,
        });
        return {
            token,
            email: dto.email,
            role,
            expiresAt,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map