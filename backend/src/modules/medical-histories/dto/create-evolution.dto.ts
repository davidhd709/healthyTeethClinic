import {
  IsDateString,
  IsMongoId,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEvolutionDto {
  @ApiPropertyOptional({ description: 'Fecha de la evolución (ISO). Por defecto: ahora' })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiPropertyOptional({ description: 'ID del especialista responsable' })
  @IsOptional()
  @IsMongoId()
  specialistId?: string;

  @ApiProperty({ description: 'Descripción clínica de la evolución', minLength: 10 })
  @IsString()
  @MinLength(10)
  description: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  diagnosis?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  treatment?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  recommendations?: string;

  @ApiPropertyOptional({ description: 'Fecha sugerida para próxima cita (ISO)' })
  @IsOptional()
  @IsDateString()
  nextAppointmentSuggestion?: string;
}
