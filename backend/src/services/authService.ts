import { memoryDB, type IUser } from '../utils/memoryDB';
import jwt from 'jsonwebtoken';

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
}

export class AuthService {
  private static generateToken(userId: string): string {
    return jwt.sign(
      { userId },
      process.env.JWT_SECRET || 'dev-secret-key',
      { expiresIn: '7d' }
    );
  }

  static async register(userData: {
    name: string;
    email: string;
    password: string;
  }): Promise<AuthResponse> {
    // Check if user already exists
    const existingUser = await memoryDB.findUserByEmail(userData.email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Create new user
    const user = await memoryDB.createUser(userData);
    
    const token = this.generateToken(user._id);
    
    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    };
  }

  static async login(email: string, password: string): Promise<AuthResponse> {
    // Find user by email
    const user = await memoryDB.findUserByEmail(email);
    if (!user || !user.password) {
      throw new Error('Invalid credentials');
    }

    // Check password
    const isPasswordValid = await memoryDB.comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const token = this.generateToken(user._id);
    
    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    };
  }

  static async googleLogin(googleToken: string): Promise<AuthResponse> {
    // For development, we'll mock the Google token verification
    // In production, this would verify the token with Google
    try {
      // Mock Google user info (in production, fetch from Google)
      const mockGoogleUser = {
        sub: 'google_123456',
        email: 'test@gmail.com',
        name: 'Google User',
        picture: 'https://via.placeholder.com/150',
        email_verified: true,
      };

      // Find user by Google ID
      let user = await memoryDB.findUserByGoogleId(mockGoogleUser.sub);
      
      if (!user) {
        // Check if user exists with same email
        const existingUser = await memoryDB.findUserByEmail(mockGoogleUser.email);
        if (existingUser) {
          // Link Google account to existing user
          user = await memoryDB.updateUser(existingUser._id, {
            googleId: mockGoogleUser.sub,
            name: mockGoogleUser.name,
            avatar: mockGoogleUser.picture,
          });
        } else {
          // Create new user from Google
          user = await memoryDB.createUser({
            name: mockGoogleUser.name,
            email: mockGoogleUser.email,
            googleId: mockGoogleUser.sub,
            avatar: mockGoogleUser.picture,
          });
        }
      } else {
        // Update existing Google user info
        user = await memoryDB.updateUser(user._id, {
          name: mockGoogleUser.name,
          avatar: mockGoogleUser.picture,
        });
      }

      if (!user) {
        throw new Error('Failed to create or update user');
      }

      const token = this.generateToken(user._id);
      
      return {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        },
      };
    } catch (error) {
      throw new Error('Invalid Google token');
    }
  }

  static async getCurrentUser(userId: string): Promise<AuthResponse['user'] | null> {
    const user = await memoryDB.findUserById(userId);
    if (!user) {
      return null;
    }

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    };
  }

  static async verifyToken(token: string): Promise<{ userId: string } | null> {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret-key') as { userId: string };
      return decoded;
    } catch (error) {
      return null;
    }
  }

  // Development helper method
  static async createTestUser(): Promise<AuthResponse> {
    const testUser = await memoryDB.createUser({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });

    const token = this.generateToken(testUser._id);
    
    return {
      token,
      user: {
        id: testUser._id,
        name: testUser.name,
        email: testUser.email,
        avatar: testUser.avatar,
      },
    };
  }
}
