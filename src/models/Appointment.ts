import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAppointmentDoc extends Document {
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  patientDocument?: string;
  serviceId: mongoose.Types.ObjectId;
  specialistId: mongoose.Types.ObjectId;
  date: Date;
  time: string;
  status: 'pendiente' | 'confirmada' | 'cancelada' | 'completada';
  reasonForVisit: string;
  internalNotes?: string;
  dataConsent: boolean;
}

const AppointmentSchema = new Schema<IAppointmentDoc>(
  {
    patientName: { type: String, required: true },
    patientEmail: { type: String, required: true },
    patientPhone: { type: String, required: true },
    patientDocument: { type: String },
    serviceId: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
    specialistId: { type: Schema.Types.ObjectId, ref: 'Specialist', required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    status: {
      type: String,
      enum: ['pendiente', 'confirmada', 'cancelada', 'completada'],
      default: 'pendiente',
    },
    reasonForVisit: { type: String, required: true },
    internalNotes: { type: String },
    dataConsent: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

AppointmentSchema.index({ specialistId: 1, date: 1, time: 1 }, { unique: true });

const Appointment: Model<IAppointmentDoc> =
  mongoose.models.Appointment || mongoose.model<IAppointmentDoc>('Appointment', AppointmentSchema);

export default Appointment;
