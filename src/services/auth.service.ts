import jwt from 'jsonwebtoken';
import { userModel, User } from '@/models/user.model.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '24h';

export interface AuthResult {
  user: Omit<User, 'password_hash'>;
  token: string;
}

export const authService = {
  // Register a new user
  register: async (email: string, password: string, name?: string): Promise<AuthResult> => {
    try {
      // Check if user already exists
      const existingUser = userModel.findByEmail(email);
      if (existingUser) {
        throw new Error('User already exists');
      }

      // Create new user
      const result = await userModel.create(email, password, name);
      const user = userModel.findById(result.lastInsertRowid as number);
      
      if (!user) {
        throw new Error('Failed to create user');
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      // Return user without password hash
      const { password_hash, ...userWithoutPassword } = user;
      return {
        user: userWithoutPassword,
        token
      };
    } catch (error) {
      console.error('\n[Auth Service Error]\n', error, '\n');
      throw new Error('User already exists');
    }
  },

  // Login user
  login: async (email: string, password: string): Promise<AuthResult> => {
    try {
      // Find user by email
      const user = userModel.findByEmail(email);
      if (!user) {
        throw new Error('Invalid credentials');
      }

      // Verify password
      const isValidPassword = await userModel.verifyPassword(password, user.password_hash);
      if (!isValidPassword) {
        throw new Error('Invalid credentials');
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      // Return user without password hash
      const { password_hash, ...userWithoutPassword } = user;
      return {
        user: userWithoutPassword,
        token
      };
    } catch (error) {
      console.error('\n[Auth Service Error]\n', error, '\n');
      throw new Error('Invalid credentials');
    }
  },

  // Verify JWT token
  verifyToken: (token: string) => {
    try {
      return jwt.verify(token, JWT_SECRET) as { userId: number; email: string };
    } catch (error) {
      console.error('\n[Auth Service Error]\n', error, '\n');
      throw new Error('Invalid token');
    }
  },

  // Get user from token
  getUserFromToken: (token: string) => {
    try {
      const decoded = authService.verifyToken(token);
      const user = userModel.findById(decoded.userId);
      
      if (!user) {
        throw new Error('User not found');
      }

      const { password_hash, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      console.error('\n[Auth Service Error]\n', error, '\n');
      throw new Error('User not found');
    }
  }
}; 