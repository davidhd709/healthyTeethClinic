import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';

export type PatientDocument = HydratedDocument<Patient>;

export type DocumentType = 'CC' | 'TI' | 'CE' | 'PP' | 'RC' | 'otro';
export type PatientSex = 'M' | 'F' | 'O';

@Schema({ _id: false })
export class EmergencyContact {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  phone: string;

  @Prop({ trim: true })
  relationship?: string;
}

const EmergencyContactSchema = SchemaFactory.createForClass(EmergencyContact);

@Schema({ _id: false })
export class MedicalInfo {
  @Prop({ type: [String], default: [] })
  allergies: string[];

  @Prop({ type: [String], default: [] })
  diseases: string[];

  @Prop({ type: [String], default: [] })
  medications: string[];

  @Prop({ trim: true })
  medicalHistory?: string;

  @Prop({ trim: true })
  dentalHistory?: string;
}

const MedicalInfoSchema = SchemaFactory.createForClass(MedicalInfo);

@Schema({ timestamps: true, collection: 'patients' })
export class Patient {
  @Prop({
    required: true,
    enum: ['CC', 'TI', 'CE', 'PP', 'RC', 'otro'],
    default: 'CC',
  })
  documentType: DocumentType;

  @Prop({ required: true, trim: true, unique: true, index: true })
  documentNumber: string;

  @Prop({ required: true, trim: true })
  firstName: string;

  @Prop({ required: true, trim: true })
  lastName: string;

  @Prop({ required: true, type: Date })
  birthDate: Date;

  @Prop({ required: true, enum: ['M', 'F', 'O'] })
  sex: PatientSex;

  @Prop({ required: true, trim: true })
  phone: string;

  @Prop({ trim: true, lowercase: true })
  email?: string;

  @Prop({ trim: true })
  address?: string;

  @Prop({ trim: true })
  city?: string;

  @Prop({ trim: true })
  insuranceProvider?: string;

  @Prop({ type: EmergencyContactSchema })
  emergencyContact?: EmergencyContact;

  @Prop({ type: MedicalInfoSchema, default: () => ({}) })
  medicalInfo: MedicalInfo;

  @Prop({ trim: true })
  observations?: string;

  @Prop({ default: true, index: true })
  isActive: boolean;

  @Prop({ type: Date })
  deletedAt?: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  createdBy?: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  updatedBy?: mongoose.Types.ObjectId;
}

export const PatientSchema = SchemaFactory.createForClass(Patient);

PatientSchema.index({ firstName: 1, lastName: 1 });
PatientSchema.index({ phone: 1 });
PatientSchema.index({ email: 1 });
