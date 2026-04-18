import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  googleId?: string;
  avatar?: string;
  favorites: string[];
  orders: string[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
  },
  password: {
    type: String,
    required(this: IUser) {
      return !this.googleId;
    },
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false,
  },
  googleId: {
    type: String,
    sparse: true,
    unique: true,
    trim: true,
  },
  avatar: {
    type: String,
    trim: true,
  },
  favorites: [{
    type: Schema.Types.ObjectId,
    ref: 'Product',
  }],
  orders: [{
    type: Schema.Types.ObjectId,
    ref: 'Order',
  }],
}, {
  timestamps: true,
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const pwd = this.get('password') as string | undefined;
  if (!pwd) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.set('password', await bcrypt.hash(pwd, salt));
    next();
  } catch (error) {
    next(error as Error);
  }
});

userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  const pwd = this.get('password') as string | undefined;
  if (!pwd) return false;
  return bcrypt.compare(candidatePassword, pwd);
};

export default mongoose.model<IUser>('User', userSchema);
