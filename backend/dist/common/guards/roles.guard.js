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
exports.RolesGuard = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const roles_decorator_1 = require("../decorators/roles.decorator");
const admin_token_util_1 = require("../utils/admin-token.util");
let RolesGuard = class RolesGuard {
    constructor(configService, reflector) {
        this.configService = configService;
        this.reflector = reflector;
    }
    canActivate(context) {
        const request = context
            .switchToHttp()
            .getRequest();
        const authHeader = request.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new common_1.UnauthorizedException('Token de autorización no proporcionado');
        }
        const token = authHeader.split(' ')[1];
        const secret = (0, admin_token_util_1.getAdminTokenSecret)(this.configService);
        const payload = (0, admin_token_util_1.verifyAdminToken)(token, secret);
        if (!payload) {
            throw new common_1.UnauthorizedException('Token inválido o expirado');
        }
        request.user = {
            email: payload.sub,
            role: payload.role,
            userId: payload.userId,
        };
        const requiredRoles = this.reflector.getAllAndOverride(roles_decorator_1.ROLES_KEY, [context.getHandler(), context.getClass()]);
        if (!requiredRoles || requiredRoles.length === 0) {
            return true;
        }
        if (payload.role === 'admin') {
            return true;
        }
        if (!requiredRoles.includes(payload.role)) {
            throw new common_1.ForbiddenException('No tienes permisos para realizar esta acción');
        }
        return true;
    }
};
exports.RolesGuard = RolesGuard;
exports.RolesGuard = RolesGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        core_1.Reflector])
], RolesGuard);
//# sourceMappingURL=roles.guard.js.map