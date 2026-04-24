import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import {
  TOOTH_STATUSES,
  ToothStatus,
} from '../constants/tooth-status.constant';
import type { ToothType, Arch } from '../constants/fdi-teeth.constant';
import {
  ToothSurfaceRecord,
  ToothSurfaceRecordSchema,
} from './tooth-surface-record.schema';

@Schema({ _id: false })
export class ToothSurfacesMap {
  @Prop({ type: ToothSurfaceRecordSchema, default: () => ({}) })
  vestibular: ToothSurfaceRecord;

  @Prop({ type: ToothSurfaceRecordSchema, default: () => ({}) })
  lingual_palatal: ToothSurfaceRecord;

  @Prop({ type: ToothSurfaceRecordSchema, default: () => ({}) })
  mesial: ToothSurfaceRecord;

  @Prop({ type: ToothSurfaceRecordSchema, default: () => ({}) })
  distal: ToothSurfaceRecord;

  @Prop({ type: ToothSurfaceRecordSchema, default: () => ({}) })
  occlusal_incisal: ToothSurfaceRecord;
}

export const ToothSurfacesMapSchema = SchemaFactory.createForClass(ToothSurfacesMap);

@Schema({ _id: false })
export class ToothRecord {
  @Prop({ required: true })
  toothNumber: string;

  @Prop({ required: true, enum: ['incisor', 'canine', 'premolar', 'molar'] })
  toothType: ToothType;

  @Prop({ required: true, enum: [1, 2, 3, 4] })
  quadrant: 1 | 2 | 3 | 4;

  @Prop({ required: true, enum: ['upper', 'lower'] })
  arch: Arch;

  @Prop({
    type: [String],
    enum: TOOTH_STATUSES,
    default: ['healthy'],
  })
  status: ToothStatus[];

  @Prop({ type: ToothSurfacesMapSchema, default: () => ({}) })
  surfaces: ToothSurfacesMap;

  @Prop({ type: [String], default: [] })
  diagnosis: string[];

  @Prop({ trim: true })
  notes?: string;

  @Prop({ type: Date })
  lastUpdated?: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  updatedBy?: mongoose.Types.ObjectId;
}

export const ToothRecordSchema = SchemaFactory.createForClass(ToothRecord);
