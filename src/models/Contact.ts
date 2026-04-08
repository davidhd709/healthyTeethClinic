import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IContactDoc extends Document {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

const ContactSchema = new Schema<IContactDoc>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    subject: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

const Contact: Model<IContactDoc> =
  mongoose.models.Contact || mongoose.model<IContactDoc>('Contact', ContactSchema);

export default Contact;
