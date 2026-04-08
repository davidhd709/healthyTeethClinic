import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IWeeklyScheduleDoc {
  day: string;
  startTime: string;
  endTime: string;
  blockDuration: number;
  breaks?: { start: string; end: string }[];
}

export interface ISpecialistDoc extends Document {
  name: string;
  slug: string;
  photo: string;
  specialty: string;
  subspecialty?: string;
  description: string;
  experience: number;
  services: mongoose.Types.ObjectId[];
  weeklySchedule: IWeeklyScheduleDoc[];
  isActive: boolean;
}

const WeeklyScheduleSchema = new Schema<IWeeklyScheduleDoc>(
  {
    day: { type: String, required: true, enum: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'] },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    blockDuration: { type: Number, required: true, default: 30 },
    breaks: [
      {
        start: { type: String },
        end: { type: String },
      },
    ],
  },
  { _id: false }
);

const SpecialistSchema = new Schema<ISpecialistDoc>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    photo: { type: String, default: '/images/default-specialist.jpg' },
    specialty: { type: String, required: true },
    subspecialty: { type: String },
    description: { type: String, required: true },
    experience: { type: Number, required: true },
    services: [{ type: Schema.Types.ObjectId, ref: 'Service' }],
    weeklySchedule: [WeeklyScheduleSchema],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Specialist: Model<ISpecialistDoc> =
  mongoose.models.Specialist || mongoose.model<ISpecialistDoc>('Specialist', SpecialistSchema);

export default Specialist;
