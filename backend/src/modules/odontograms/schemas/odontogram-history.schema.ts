import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import {
  SURFACE_NAMES,
  SurfaceName,
  TOOTH_STATUSES,
  ToothStatus,
} from '../constants/tooth-status.constant';

export type OdontogramHistoryDocument = HydratedDocument<OdontogramHistory>;
export type OdontogramHistorySource = 'manual' | 'procedure';

@Schema({ timestamps: true, collection: 'odontogram_history' })
export class OdontogramHistory {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
    index: true,
  })
  patientId: mongoose.Types.ObjectId;

  @Prop({ required: true, index: true })
  toothNumber: string;

  @Prop({ enum: SURFACE_NAMES })
  surface?: SurfaceName;

  @Prop({ type: [String], enum: TOOTH_STATUSES, default: [] })
  previousStatus: ToothStatus[];

  @Prop({ type: [String], enum: TOOTH_STATUSES, default: [] })
  newStatus: ToothStatus[];

  @Prop({ trim: true })
  diagnosis?: string;

  @Prop({ trim: true })
  procedure?: string;

  @Prop({ trim: true })
  notes?: string;

  @Prop({
    required: true,
    enum: ['manual', 'procedure'],
    default: 'manual',
  })
  source: OdontogramHistorySource;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  updatedBy?: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Specialist' })
  specialistId?: mongoose.Types.ObjectId;
}

export const OdontogramHistorySchema = SchemaFactory.createForClass(OdontogramHistory);

OdontogramHistorySchema.index({ patientId: 1, toothNumber: 1, createdAt: -1 });
