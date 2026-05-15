// Simple in-memory database for development testing
import bcrypt from 'bcryptjs';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  googleId?: string;
  avatar?: string;
  favorites: string[];
  orders: string[];
  createdAt: Date;
  updatedAt: Date;
}

class MemoryDB {
  private users: Map<string, IUser> = new Map();
  private nextId = 1;

  async generateId(): Promise<string> {
    return (this.nextId++).toString();
  }

  async createUser(userData: {
    name: string;
    email: string;
    password?: string;
    googleId?: string;
    avatar?: string;
  }): Promise<IUser> {
    const id = await this.generateId();
    const hashedPassword = userData.password ? await bcrypt.hash(userData.password, 12) : undefined;
    
    const user: IUser = {
      _id: id,
      name: userData.name,
      email: userData.email.toLowerCase(),
      password: hashedPassword,
      googleId: userData.googleId,
      avatar: userData.avatar,
      favorites: [],
      orders: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.set(id, user);
    return user;
  }

  async findUserByEmail(email: string): Promise<IUser | null> {
    const lowerEmail = email.toLowerCase();
    for (const user of this.users.values()) {
      if (user.email === lowerEmail) {
        return user;
      }
    }
    return null;
  }

  async findUserById(id: string): Promise<IUser | null> {
    return this.users.get(id) || null;
  }

  async findUserByGoogleId(googleId: string): Promise<IUser | null> {
    for (const user of this.users.values()) {
      if (user.googleId === googleId) {
        return user;
      }
    }
    return null;
  }

  async updateUser(id: string, updates: Partial<IUser>): Promise<IUser | null> {
    const user = this.users.get(id);
    if (!user) return null;

    const updatedUser = {
      ...user,
      ...updates,
      updatedAt: new Date(),
    };

    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  // Helper method for testing
  async clearAll(): Promise<void> {
    this.users.clear();
    this.nextId = 1;
  }

  // Get all users (for testing)
  async getAllUsers(): Promise<IUser[]> {
    return Array.from(this.users.values());
  }
}

export const memoryDB = new MemoryDB();
