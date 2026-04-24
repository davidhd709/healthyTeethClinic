import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import {
  TOOTH_STATUSES,
  ToothStatus,
  PROCEDURE_STATUSES,
  ProcedureStatus,
} from '../constants/tooth-status.constant';

@Schema({ _id: false })
export class ToothSurfaceRecord {
  @Prop({ enum: TOOTH_STATUSES })
  condition?: ToothStatus;

  @Prop({ trim: true })
  treatment?: string;

  @Prop({
    enum: PROCEDURE_STATUSES,
    default: 'none',
  })
  status: ProcedureStatus;

  @Prop({ trim: true })
  notes?: string;

  @Prop({ type: Date })
  date?: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Specialist' })
  specialistId?: mongoose.Types.ObjectId;

  @Prop({ type: Date })
  lastUpdated?: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  updatedBy?: mongoose.Types.ObjectId;
}

export const ToothSurfaceRecordSchema = SchemaFactory.createForClass(ToothSurfaceRecord);
