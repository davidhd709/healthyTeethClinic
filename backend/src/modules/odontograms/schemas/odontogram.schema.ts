import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { ToothRecord, ToothRecordSchema } from './tooth-record.schema';

export type OdontogramDocument = HydratedDocument<Odontogram>;
export type DentitionType = 'permanent' | 'temporary' | 'mixed';

@Schema({ timestamps: true, collection: 'odontograms' })
export class Odontogram {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
    unique: true,
    index: true,
  })
  patientId: mongoose.Types.ObjectId;

  @Prop({
    required: true,
    enum: ['permanent', 'temporary', 'mixed'],
    default: 'permanent',
  })
  dentitionType: DentitionType;

  @Prop({ type: [ToothRecordSchema], default: [] })
  teeth: ToothRecord[];

  @Prop({ default: true, index: true })
  isActive: boolean;

  @Prop({ type: Date })
  deletedAt?: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  createdBy?: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  updatedBy?: mongoose.Types.ObjectId;
}

export const OdontogramSchema = SchemaFactory.createForClass(Odontogram);
