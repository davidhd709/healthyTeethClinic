import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { AuthenticatedUser, UserRole } from '../types/jwt-payload.type';
import { getAdminTokenSecret, verifyAdminToken } from '../utils/admin-token.util';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: AuthenticatedUser }>();

    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token de autorización no proporcionado');
    }

    const token = authHeader.split(' ')[1];
    const secret = getAdminTokenSecret(this.configService);
    const payload = verifyAdminToken(token, secret);
    if (!payload) {
      throw new UnauthorizedException('Token inválido o expirado');
    }

    request.user = {
      email: payload.sub,
      role: payload.role,
      userId: payload.userId,
    };

    const requiredRoles = this.reflector.getAllAndOverride<UserRole[] | undefined>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    if (payload.role === 'admin') {
      return true;
    }

    if (!requiredRoles.includes(payload.role)) {
      throw new ForbiddenException('No tienes permisos para realizar esta acción');
    }

    return true;
  }
}
