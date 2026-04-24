import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../../../common/types/jwt-payload.type';

export class QueryUserDto {
  @ApiPropertyOptional({ enum: ['admin', 'specialist', 'receptionist'] })
  @IsOptional()
  @IsEnum(['admin', 'specialist', 'receptionist'])
  role?: UserRole;

  @ApiPropertyOptional({ description: 'Pasar "all" para incluir inactivos' })
  @IsOptional()
  @IsString()
  active?: string;

  @ApiPropertyOptional({ description: 'Búsqueda por nombre o email' })
  @IsOptional()
  @IsString()
  search?: string;
}
