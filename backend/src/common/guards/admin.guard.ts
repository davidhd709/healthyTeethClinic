import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { getAdminTokenSecret, verifyAdminToken } from '../utils/admin-token.util';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
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

    const adminEmail = this.configService.get<string>('ADMIN_EMAIL');
    if (payload.sub !== adminEmail) {
      throw new UnauthorizedException('Credenciales de administrador inválidas');
    }

    return true;
  }
}
