import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsArray,
  ValidateNested,
  Min,
  MinLength,
  IsMongoId,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BreakDto {
  @ApiProperty({ example: '12:00' })
  @IsString()
  start: string;

  @ApiProperty({ example: '13:00' })
  @IsString()
  end: string;
}

export class WeeklyScheduleDto {
  @ApiProperty({ example: 'lunes' })
  @IsString()
  day: string;

  @ApiProperty({ example: '08:00' })
  @IsString()
  startTime: string;

  @ApiProperty({ example: '17:00' })
  @IsString()
  endTime: string;

  @ApiProperty({ example: 30 })
  @IsNumber()
  blockDuration: number;

  @ApiPropertyOptional({ type: [BreakDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BreakDto)
  breaks?: BreakDto[];
}

export class CreateSpecialistDto {
  @ApiProperty({ example: 'Dra. María Alejandra Rodríguez' })
  @IsString()
  @MinLength(3)
  name: string;

  @ApiPropertyOptional({ example: 'dra-maria-rodriguez' })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiPropertyOptional({ example: '/images/specialist-1.jpg' })
  @IsString()
  @IsOptional()
  photo?: string;

  @ApiProperty({ example: 'Odontología General' })
  @IsString()
  @MinLength(3)
  specialty: string;

  @ApiPropertyOptional({ example: 'Odontología Preventiva' })
  @IsString()
  @IsOptional()
  subspecialty?: string;

  @ApiProperty({ description: 'Descripción profesional del especialista' })
  @IsString()
  @MinLength(10)
  description: string;

  @ApiProperty({ description: 'Años de experiencia', example: 12 })
  @IsNumber()
  @Min(1)
  experience: number;

  @ApiPropertyOptional({ description: 'IDs de servicios asociados', type: [String] })
  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  services?: string[];

  @ApiPropertyOptional({ description: 'Horario semanal', type: [WeeklyScheduleDto] })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => WeeklyScheduleDto)
  weeklySchedule?: WeeklyScheduleDto[];

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
