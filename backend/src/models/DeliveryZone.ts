import mongoose, { Document, Schema } from 'mongoose';

export interface IDeliveryZone extends Document {
  zoneId: string;
  name: string;
  towns: string[];
  basePrice: number;
  estimatedDays: number;
  isActive: boolean;
  country: string;
  createdAt: Date;
  updatedAt: Date;
}

const deliveryZoneSchema = new Schema<IDeliveryZone>({
  zoneId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  towns: [{
    type: String,
    required: true,
    trim: true,
  }],
  basePrice: {
    type: Number,
    required: true,
    min: [0, 'Base price cannot be negative'],
  },
  estimatedDays: {
    type: Number,
    required: true,
    min: [1, 'Estimated days must be at least 1'],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  country: {
    type: String,
    required: true,
    default: 'Kenya',
    trim: true,
  },
}, {
  timestamps: true,
});

// Index for faster queries (zoneId already has unique index)
deliveryZoneSchema.index({ towns: 1 });
deliveryZoneSchema.index({ country: 1 });
deliveryZoneSchema.index({ isActive: 1 });

export default mongoose.model<IDeliveryZone>('DeliveryZone', deliveryZoneSchema);
