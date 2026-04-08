import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Service, ServiceSchema } from '../services/schemas/service.schema';
import {
  Specialist,
  SpecialistSchema,
} from '../specialists/schemas/specialist.schema';
import {
  Appointment,
  AppointmentSchema,
} from '../appointments/schemas/appointment.schema';
import { Contact, ContactSchema } from '../contact/schemas/contact.schema';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Service.name, schema: ServiceSchema },
      { name: Specialist.name, schema: SpecialistSchema },
      { name: Appointment.name, schema: AppointmentSchema },
      { name: Contact.name, schema: ContactSchema },
    ]),
  ],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
