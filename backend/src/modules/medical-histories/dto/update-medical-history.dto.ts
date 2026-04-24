import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateMedicalHistoryDto {
  @ApiPropertyOptional({ description: 'Motivo de consulta actual' })
  @IsOptional()
  @IsString()
  chiefComplaint?: string;

  @ApiPropertyOptional({ description: 'Diagnóstico inicial' })
  @IsOptional()
  @IsString()
  initialDiagnosis?: string;

  @ApiPropertyOptional({ description: 'Plan de tratamiento' })
  @IsOptional()
  @IsString()
  treatmentPlan?: string;

  @ApiPropertyOptional({ description: 'Observaciones clínicas generales' })
  @IsOptional()
  @IsString()
  generalObservations?: string;
}
