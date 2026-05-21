import mongoose, { Document, Schema } from 'mongoose';

export interface IQuoteRequest extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  company?: string;
  description: string;
  quantity?: string;
  workSubmissionDate?: string;
  brandingTypes?: string[];
  specialInstructions?: string;
  referenceFile?: string;
  status: 'submitted' | 'reviewed' | 'closed';
  createdAt: Date;
  updatedAt: Date;
}

const quoteRequestSchema = new Schema<IQuoteRequest>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    company: { type: String, trim: true },
    description: { type: String, required: true, trim: true },
    quantity: { type: String, trim: true },
    workSubmissionDate: { type: String, trim: true },
    brandingTypes: [{ type: String }],
    specialInstructions: { type: String, trim: true },
    referenceFile: { type: String, trim: true },
    status: {
      type: String,
      enum: ['submitted', 'reviewed', 'closed'],
      default: 'submitted',
    },
  },
  { timestamps: true }
);

export default mongoose.model<IQuoteRequest>('QuoteRequest', quoteRequestSchema);
