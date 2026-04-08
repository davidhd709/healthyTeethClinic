import { PartialType } from '@nestjs/swagger';
import { IsString, IsIn, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateAppointmentDto } from './create-appointment.dto';

export class UpdateAppointmentDto extends PartialType(CreateAppointmentDto) {
  @ApiProperty({
    description: 'Estado de la cita',
    enum: ['pendiente', 'confirmada', 'cancelada', 'completada'],
    required: false,
  })
  @IsString()
  @IsIn(['pendiente', 'confirmada', 'cancelada', 'completada'])
  @IsOptional()
  status?: string;

  @ApiProperty({ description: 'Notas internas (solo admin)', required: false })
  @IsString()
  @IsOptional()
  internalNotes?: string;
}

export class UpdateStatusDto {
  @ApiProperty({
    description: 'Nuevo estado de la cita',
    enum: ['pendiente', 'confirmada', 'cancelada', 'completada'],
  })
  @IsString()
  @IsIn(['pendiente', 'confirmada', 'cancelada', 'completada'])
  status: string;
}
