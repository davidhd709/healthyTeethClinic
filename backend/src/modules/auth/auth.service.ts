import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';
import {
  generateAdminToken,
  getAdminTokenSecret,
  getAdminTokenTtlSeconds,
} from '../../common/utils/admin-token.util';
import { UserRole } from '../../common/types/jwt-payload.type';
import { UsersService } from '../users/users.service';
import { verifyPassword } from '../../common/utils/password.util';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  async login(dto: LoginDto) {
    const email = dto.email.toLowerCase().trim();
    const secret = getAdminTokenSecret(this.configService);
    const ttlSeconds = getAdminTokenTtlSeconds(this.configService);

    const dbUser = await this.usersService.findByEmailWithPassword(email);
    if (dbUser) {
      const ok = await verifyPassword(dto.password, dbUser.passwordHash);
      if (!ok) {
        throw new UnauthorizedException('Credenciales inválidas');
      }
      const userId = String(dbUser._id);
      await this.usersService.touchLastLogin(userId);

      const { token, expiresAt } = generateAdminToken({
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

    const adminEmail = this.configService.get<string>('ADMIN_EMAIL');
    const adminPassword = this.configService.get<string>('ADMIN_PASSWORD');
    if (adminEmail && adminPassword && email === adminEmail && dto.password === adminPassword) {
      const role: UserRole = 'admin';
      const { token, expiresAt } = generateAdminToken({
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

    throw new UnauthorizedException('Credenciales inválidas');
  }
}
