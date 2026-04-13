import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BotService } from './bot.service';
import { CreateAppointmentDto } from '../appointments/dto/create-appointment.dto';

@ApiTags('Bot')
@Controller('api/bot')
export class BotController {
  constructor(private readonly botService: BotService) {}

  @Get('services')
  async getServices(@Query('format') format?: string) {
    if (format === 'text') {
      const text = await this.botService.formatServicesText();
      return { text };
    }
    const services = await this.botService.listServices();
    return { services };
  }

  @Get('specialists')
  async getSpecialists(
    @Query('serviceId') serviceId?: string,
    @Query('format') format?: string,
  ) {
    if (format === 'text') {
      const text = await this.botService.formatSpecialistsText(serviceId);
      return { text };
    }
    const specialists = await this.botService.listSpecialists(serviceId);
    return { specialists };
  }

  @Get('availability')
  async getAvailability(
    @Query('specialistId') specialistId: string,
    @Query('date') date: string,
  ) {
    return this.botService.getAvailability(specialistId, date);
  }

  @Post('appointments')
  async createAppointment(@Body() dto: CreateAppointmentDto) {
    return this.botService.createAppointment(dto);
  }
}
