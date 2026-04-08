import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiQuery } from '@nestjs/swagger';
import { AvailabilityService } from './availability.service';
import { ParseObjectIdPipe } from '../../common/pipes/parse-objectid.pipe';

@ApiTags('Availability')
@Controller('api/availability')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @Get()
  @ApiQuery({ name: 'specialistId', required: true, description: 'ID del especialista' })
  @ApiQuery({ name: 'date', required: true, description: 'Fecha (YYYY-MM-DD)' })
  getAvailability(
    @Query('specialistId', ParseObjectIdPipe) specialistId: string,
    @Query('date') date: string,
  ) {
    if (!specialistId || !date) {
      throw new BadRequestException(
        'Los parámetros specialistId y date son requeridos',
      );
    }
    return this.availabilityService.getAvailability(specialistId, date);
  }
}
