import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IServiceDoc extends Document {
  name: string;
  slug: string;
  description: string;
  durationMinutes: number;
  basePrice?: number;
  icon: string;
  image?: string;
  specialists: mongoose.Types.ObjectId[];
  isActive: boolean;
}

const ServiceSchema = new Schema<IServiceDoc>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    durationMinutes: { type: Number, required: true, default: 30 },
    basePrice: { type: Number },
    icon: { type: String, required: true, default: 'Stethoscope' },
    image: { type: String },
    specialists: [{ type: Schema.Types.ObjectId, ref: 'Specialist' }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Service: Model<IServiceDoc> =
  mongoose.models.Service || mongoose.model<IServiceDoc>('Service', ServiceSchema);

export default Service;
