import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Patient, PatientSchema } from './schemas/patient.schema';
import { PatientsService } from './patients.service';
import { PatientsController } from './patients.controller';
import { AppointmentsModule } from '../appointments/appointments.module';
import { MedicalHistoriesModule } from '../medical-histories/medical-histories.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Patient.name, schema: PatientSchema }]),
    forwardRef(() => AppointmentsModule),
    MedicalHistoriesModule,
  ],
  controllers: [PatientsController],
  providers: [PatientsService],
  exports: [PatientsService],
})
export class PatientsModule {}
