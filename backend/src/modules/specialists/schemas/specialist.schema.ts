import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';

export type SpecialistDocument = HydratedDocument<Specialist>;

@Schema({ timestamps: true })
export class Specialist {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ default: '/images/default-specialist.jpg' })
  photo: string;

  @Prop({ required: true })
  specialty: string;

  @Prop()
  subspecialty: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  experience: number;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }] })
  services: mongoose.Types.ObjectId[];

  @Prop({
    type: [
      {
        day: String,
        startTime: String,
        endTime: String,
        blockDuration: Number,
        breaks: [{ start: String, end: String }],
      },
    ],
  })
  weeklySchedule: Array<{
    day: string;
    startTime: string;
    endTime: string;
    blockDuration: number;
    breaks?: Array<{ start: string; end: string }>;
  }>;

  @Prop({ default: true })
  isActive: boolean;
}

export const SpecialistSchema = SchemaFactory.createForClass(Specialist);
