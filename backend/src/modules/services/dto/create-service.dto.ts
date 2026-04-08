import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  Min,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateServiceDto {
  @ApiProperty({ description: 'Nombre del servicio', example: 'Odontología General' })
  @IsString()
  @MinLength(3)
  name: string;

  @ApiPropertyOptional({ description: 'Slug URL-friendly', example: 'odontologia-general' })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({ description: 'Descripción detallada del servicio' })
  @IsString()
  @MinLength(10)
  description: string;

  @ApiProperty({ description: 'Duración en minutos', example: 30 })
  @IsNumber()
  @Min(15)
  durationMinutes: number;

  @ApiPropertyOptional({ description: 'Precio base en COP', example: 80000 })
  @IsNumber()
  @IsOptional()
  basePrice?: number;

  @ApiPropertyOptional({ description: 'Nombre del icono Lucide', example: 'Stethoscope' })
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiPropertyOptional({ description: '¿Servicio activo?' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
