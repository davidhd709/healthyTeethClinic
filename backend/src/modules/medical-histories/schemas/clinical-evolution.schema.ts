import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

@Schema({ _id: true, timestamps: true })
export class ClinicalEvolution {
  _id?: mongoose.Types.ObjectId;

  @Prop({ required: true, type: Date, default: () => new Date() })
  date: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Specialist' })
  specialistId?: mongoose.Types.ObjectId;

  @Prop({ required: true, trim: true })
  description: string;

  @Prop({ trim: true })
  diagnosis?: string;

  @Prop({ trim: true })
  treatment?: string;

  @Prop({ trim: true })
  recommendations?: string;

  @Prop({ type: Date })
  nextAppointmentSuggestion?: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  createdBy?: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  updatedBy?: mongoose.Types.ObjectId;
}

export const ClinicalEvolutionSchema = SchemaFactory.createForClass(ClinicalEvolution);
