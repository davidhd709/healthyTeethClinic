import { IsString, IsEmail, IsOptional, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateContactDto {
  @ApiProperty({ example: 'María García' })
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty({ example: 'maria@email.com' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: '3001234567' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: 'Consulta sobre blanqueamiento' })
  @IsString()
  @MinLength(3)
  subject: string;

  @ApiProperty({ example: 'Me gustaría saber más sobre el procedimiento de blanqueamiento dental.' })
  @IsString()
  @MinLength(10)
  message: string;
}
