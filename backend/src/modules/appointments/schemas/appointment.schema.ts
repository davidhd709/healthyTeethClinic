import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';

export type AppointmentDocument = HydratedDocument<Appointment>;

@Schema({ timestamps: true })
export class Appointment {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Patient', index: true })
  patientId?: mongoose.Types.ObjectId;

  @Prop({ required: true })
  patientName: string;

  @Prop({ required: true })
  patientEmail: string;

  @Prop({ required: true })
  patientPhone: string;

  @Prop()
  patientDocument: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true })
  serviceId: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Specialist', required: true })
  specialistId: mongoose.Types.ObjectId;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  time: string;

  @Prop({
    enum: ['pendiente', 'confirmada', 'cancelada', 'completada'],
    default: 'pendiente',
  })
  status: string;

  @Prop({ required: true })
  reasonForVisit: string;

  @Prop()
  internalNotes: string;

  @Prop({ required: true, default: false })
  dataConsent: boolean;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);

AppointmentSchema.index({ specialistId: 1, date: 1, time: 1 }, { unique: true });
