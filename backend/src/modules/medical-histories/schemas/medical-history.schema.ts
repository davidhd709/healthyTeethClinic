import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import {
  ClinicalEvolution,
  ClinicalEvolutionSchema,
} from './clinical-evolution.schema';

export type MedicalHistoryDocument = HydratedDocument<MedicalHistory>;

@Schema({ timestamps: true, collection: 'medical_histories' })
export class MedicalHistory {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
    unique: true,
    index: true,
  })
  patientId: mongoose.Types.ObjectId;

  @Prop({ trim: true })
  chiefComplaint?: string;

  @Prop({ trim: true })
  initialDiagnosis?: string;

  @Prop({ trim: true })
  treatmentPlan?: string;

  @Prop({ trim: true })
  generalObservations?: string;

  @Prop({ type: [ClinicalEvolutionSchema], default: [] })
  evolutions: ClinicalEvolution[];

  @Prop({ default: true, index: true })
  isActive: boolean;

  @Prop({ type: Date })
  deletedAt?: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  createdBy?: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  updatedBy?: mongoose.Types.ObjectId;
}

export const MedicalHistorySchema = SchemaFactory.createForClass(MedicalHistory);
