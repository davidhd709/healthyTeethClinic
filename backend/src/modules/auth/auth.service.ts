import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';
import {
  generateAdminToken,
  getAdminTokenSecret,
  getAdminTokenTtlSeconds,
} from '../../common/utils/admin-token.util';

@Injectable()
export class AuthService {
  constructor(private readonly configService: ConfigService) {}

  async login(dto: LoginDto) {
    const adminEmail = this.configService.get<string>('ADMIN_EMAIL');
    const adminPassword = this.configService.get<string>('ADMIN_PASSWORD');

    if (dto.email !== adminEmail || dto.password !== adminPassword) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const secret = getAdminTokenSecret(this.configService);
    const ttlSeconds = getAdminTokenTtlSeconds(this.configService);
    const { token, expiresAt } = generateAdminToken(dto.email, secret, ttlSeconds);

    return {
      token,
      email: dto.email,
      expiresAt,
    };
  }
}
