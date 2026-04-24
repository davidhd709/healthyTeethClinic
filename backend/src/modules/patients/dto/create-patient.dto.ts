import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { DocumentType, PatientSex } from '../schemas/patient.schema';

export class EmergencyContactDto {
  @ApiProperty({ example: 'María Pérez' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ example: '3001234567' })
  @IsString()
  @MinLength(7)
  phone: string;

  @ApiPropertyOptional({ example: 'Madre' })
  @IsOptional()
  @IsString()
  relationship?: string;
}

export class MedicalInfoDto {
  @ApiPropertyOptional({ type: [String], example: ['Penicilina'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  allergies?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  diseases?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  medications?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  medicalHistory?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  dentalHistory?: string;
}

export class CreatePatientDto {
  @ApiProperty({ enum: ['CC', 'TI', 'CE', 'PP', 'RC', 'otro'], example: 'CC' })
  @IsEnum(['CC', 'TI', 'CE', 'PP', 'RC', 'otro'])
  documentType: DocumentType;

  @ApiProperty({ example: '1234567890' })
  @IsString()
  @MinLength(3)
  documentNumber: string;

  @ApiProperty({ example: 'Juan' })
  @IsString()
  @MinLength(2)
  firstName: string;

  @ApiProperty({ example: 'Pérez' })
  @IsString()
  @MinLength(2)
  lastName: string;

  @ApiProperty({ example: '1990-05-12', description: 'YYYY-MM-DD' })
  @IsDateString()
  birthDate: string;

  @ApiProperty({ enum: ['M', 'F', 'O'] })
  @IsEnum(['M', 'F', 'O'])
  sex: PatientSex;

  @ApiProperty({ example: '3001234567' })
  @IsString()
  @MinLength(7)
  phone: string;

  @ApiPropertyOptional({ example: 'juan@email.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ description: 'EPS o aseguradora' })
  @IsOptional()
  @IsString()
  insuranceProvider?: string;

  @ApiPropertyOptional({ type: EmergencyContactDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => EmergencyContactDto)
  emergencyContact?: EmergencyContactDto;

  @ApiPropertyOptional({ type: MedicalInfoDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => MedicalInfoDto)
  medicalInfo?: MedicalInfoDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  observations?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
