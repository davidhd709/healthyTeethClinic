import {
  IsDateString,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  PROCEDURE_STATUSES,
  ProcedureStatus,
  TOOTH_STATUSES,
  ToothStatus,
} from '../constants/tooth-status.constant';

export class UpdateSurfaceDto {
  @ApiPropertyOptional({ enum: TOOTH_STATUSES, description: 'Condición clínica de la superficie' })
  @IsOptional()
  @IsEnum(TOOTH_STATUSES)
  condition?: ToothStatus;

  @ApiPropertyOptional({ description: 'Tratamiento aplicado o planeado' })
  @IsOptional()
  @IsString()
  treatment?: string;

  @ApiPropertyOptional({ enum: PROCEDURE_STATUSES })
  @IsOptional()
  @IsEnum(PROCEDURE_STATUSES)
  status?: ProcedureStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ description: 'Fecha del registro (ISO)' })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId()
  specialistId?: string;
}
