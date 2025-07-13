import { userModel } from '@/models/user.model.js';

export interface CreateUserData {
  email: string;
  password: string;
  name?: string;
  homeDirectory?: string;
}

export const userService = {
  // Create a new user
  createUser: async (userData: CreateUserData) => {
    try {
      // Create user in database
      const userResult = await userModel.create(
        userData.email,
        userData.password,
        userData.name,
        'user',
        userData.homeDirectory
      );

      if (!userResult.lastInsertRowid) {
        throw new Error('Failed to create user');
      }

      return {
        success: true,
        userId: userResult.lastInsertRowid
      };
    } catch (error) {
      console.error('\n[User Service Error]\n', error, '\n');
      throw new Error('Failed to create user');
    }
  },

  // Get all users (admin only)
  getAllUsers: () => {
    return userModel.getAllUsers();
  },

  // Check if user is admin
  isAdmin: (userId: number) => {
    return userModel.isAdmin(userId);
  },

  // Check if setup is complete
  isSetupComplete: () => {
    return userModel.isSetupComplete();
  }
}; 