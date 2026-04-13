import { Module } from '@nestjs/common';
import { BotController } from './bot.controller';
import { BotService } from './bot.service';
import { ServicesModule } from '../services/services.module';
import { SpecialistsModule } from '../specialists/specialists.module';
import { AvailabilityModule } from '../availability/availability.module';
import { AppointmentsModule } from '../appointments/appointments.module';

@Module({
  imports: [
    ServicesModule,
    SpecialistsModule,
    AvailabilityModule,
    AppointmentsModule,
  ],
  controllers: [BotController],
  providers: [BotService],
})
export class BotModule {}
