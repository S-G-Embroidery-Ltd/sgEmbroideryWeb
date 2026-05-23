import mongoose, { Document, Schema } from 'mongoose';

export interface IQuoteRequest extends Document {
  userId?: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  company?: string;
  description: string;
  quantity?: string;
  workSubmissionDate?: string;
  brandingTypes?: string[];
  specialInstructions?: string;
  referenceFiles?: string[];
  status: 'submitted' | 'reviewed' | 'closed';
  createdAt: Date;
  updatedAt: Date;
}

const quoteRequestSchema = new Schema<IQuoteRequest>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
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
    referenceFiles: [{ type: String, trim: true }],
    status: {
      type: String,
      enum: ['submitted', 'reviewed', 'closed'],
      default: 'submitted',
    },
  },
  { timestamps: true }
);

// Index for better query performance
quoteRequestSchema.index({ email: 1 });
quoteRequestSchema.index({ userId: 1 }, { sparse: true });
quoteRequestSchema.index({ status: 1 });
quoteRequestSchema.index({ createdAt: -1 });

export default mongoose.model<IQuoteRequest>('QuoteRequest', quoteRequestSchema);
