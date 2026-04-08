import {
  IsString,
  IsEmail,
  IsBoolean,
  IsOptional,
  MinLength,
  IsMongoId,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAppointmentDto {
  @ApiProperty({ example: 'Juan Pérez' })
  @IsString()
  @MinLength(3)
  patientName: string;

  @ApiProperty({ example: 'juan@email.com' })
  @IsEmail()
  patientEmail: string;

  @ApiProperty({ example: '3001234567' })
  @IsString()
  @MinLength(7)
  patientPhone: string;

  @ApiPropertyOptional({ example: '1234567890' })
  @IsString()
  @IsOptional()
  patientDocument?: string;

  @ApiProperty({ description: 'ID del servicio' })
  @IsMongoId()
  serviceId: string;

  @ApiProperty({ description: 'ID del especialista' })
  @IsMongoId()
  specialistId: string;

  @ApiProperty({ description: 'Fecha de la cita (YYYY-MM-DD)', example: '2026-04-15' })
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'La fecha debe tener formato YYYY-MM-DD',
  })
  date: string;

  @ApiProperty({ description: 'Hora de la cita (HH:mm)', example: '09:00' })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'La hora debe tener formato HH:mm',
  })
  time: string;

  @ApiProperty({ description: 'Motivo de la consulta' })
  @IsString()
  @MinLength(10)
  reasonForVisit: string;

  @ApiProperty({ description: 'Consentimiento de tratamiento de datos' })
  @IsBoolean()
  dataConsent: boolean;
}
