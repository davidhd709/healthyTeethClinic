import {
  ArrayUnique,
  IsArray,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  TOOTH_STATUSES,
  ToothStatus,
} from '../constants/tooth-status.constant';

export class UpdateToothDto {
  @ApiPropertyOptional({
    description: 'Lista completa de estados clínicos del diente',
    enum: TOOTH_STATUSES,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsEnum(TOOTH_STATUSES, { each: true })
  status?: ToothStatus[];

  @ApiPropertyOptional({ description: 'Diagnósticos asociados al diente' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  diagnosis?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ description: 'Especialista responsable del cambio' })
  @IsOptional()
  @IsMongoId()
  specialistId?: string;
}
