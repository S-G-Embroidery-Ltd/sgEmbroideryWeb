import mongoose, { Schema, Document } from 'mongoose';

export interface IVolunteer extends Document {
  userId?: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  volunteerType: string;
  skills: string;
  availability: string;
  message: string;
  status: 'new' | 'reviewing' | 'contacted' | 'accepted' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const VolunteerSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  volunteerType: {
    type: String,
    required: true,
    trim: true,
  },
  skills: {
    type: String,
    required: true,
    trim: true,
  },
  availability: {
    type: String,
    required: true,
    trim: true,
  },
  message: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['new', 'reviewing', 'contacted', 'accepted', 'rejected'],
    default: 'new',
  },
}, {
  timestamps: true,
});

// Index for better query performance
VolunteerSchema.index({ email: 1 });
VolunteerSchema.index({ userId: 1 }, { sparse: true });
VolunteerSchema.index({ status: 1 });
VolunteerSchema.index({ volunteerType: 1 });
VolunteerSchema.index({ createdAt: -1 });

export default mongoose.model<IVolunteer>('Volunteer', VolunteerSchema);
