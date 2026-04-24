import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../../../common/types/jwt-payload.type';

export class CreateUserDto {
  @ApiProperty({ example: 'dra.rodriguez@healthyteeth.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ minLength: 8, example: 'ClaveSegura123' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: 'Dra. María Rodríguez' })
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty({ enum: ['admin', 'specialist', 'receptionist'] })
  @IsEnum(['admin', 'specialist', 'receptionist'])
  role: UserRole;

  @ApiPropertyOptional({ description: 'ID del especialista vinculado (solo cuando role=specialist)' })
  @IsOptional()
  @IsMongoId()
  specialistId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
