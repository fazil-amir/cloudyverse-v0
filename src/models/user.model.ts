import { getDatabase } from '@/database/connection.js';
import bcrypt from 'bcrypt';

export interface User {
  id: number;
  email: string;
  password_hash: string;
  name?: string;
  home_directory?: string;
  role: 'admin' | 'user';
  created_at: string;
  updated_at: string;
}

export const userModel = {
  // Create a new user
  create: async (email: string, password: string, name?: string, role: 'admin' | 'user' = 'user', homeDirectory?: string) => {
    try {
      const db = getDatabase();
      const passwordHash = await bcrypt.hash(password, 10);
      const stmt = db.prepare(`
        INSERT INTO users (email, password_hash, name, home_directory, role, created_at, updated_at) 
        VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `);
      const result = stmt.run(email, passwordHash, name, homeDirectory, role);
      return result;
    } catch (error) {
      console.error('Error in userModel.create:', error);
      throw error;
    }
  },

  // Find user by email
  findByEmail: (email: string) => {
    try {
      const db = getDatabase();
      const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
      return stmt.get(email) as User | undefined;
    } catch (error) {
      console.error('Error in userModel.findByEmail:', error);
      return undefined;
    }
  },

  // Find user by ID
  findById: (id: number) => {
    try {
      const db = getDatabase();
      const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
      return stmt.get(id) as User | undefined;
    } catch (error) {
      console.error('Error in userModel.findById:', error);
      return undefined;
    }
  },

  // Update user
  update: (id: number, updates: Partial<Omit<User, 'id' | 'created_at'>>) => {
    try {
      const db = getDatabase();
      const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
      const values = Object.values(updates);
      const stmt = db.prepare(`
        UPDATE users 
        SET ${fields}, updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?
      `);
      return stmt.run(...values, id);
    } catch (error) {
      console.error('Error in userModel.update:', error);
      throw error;
    }
  },

  // Verify password
  verifyPassword: async (password: string, hash: string) => {
    try {
      return await bcrypt.compare(password, hash);
    } catch (error) {
      console.error('Error in userModel.verifyPassword:', error);
      throw error;
    }
  },

  // Check if user is admin
  isAdmin: (userId: number) => {
    try {
      const db = getDatabase();
      const stmt = db.prepare('SELECT role FROM users WHERE id = ?');
      const result = stmt.get(userId) as { role: string } | undefined;
      return result?.role === 'admin';
    } catch (error) {
      console.error('Error in userModel.isAdmin:', error);
      return false;
    }
  },

  // Get all users (for admin)
  getAllUsers: () => {
    try {
      const db = getDatabase();
      const stmt = db.prepare('SELECT id, email, name, role, created_at FROM users ORDER BY created_at DESC');
      return stmt.all() as Array<{
        id: number;
        email: string;
        name?: string;
        role: string;
        created_at: string;
      }>;
    } catch (error) {
      console.error('Error in userModel.getAllUsers:', error);
      return [];
    }
  },

  // Check if setup is complete (has at least one admin user)
  isSetupComplete: () => {
    try {
      const db = getDatabase();

      const stmt = db.prepare(
        'SELECT COUNT(*) AS count FROM users WHERE LOWER(role) = LOWER(?)'
      );
  
      // Bind the value safely
      const result = stmt.get('admin') as { count: number };
      return result.count > 0;
    } catch (error) {
      console.error('Error in userModel.isSetupComplete:', error);
      return false;
    }
  }
}; 