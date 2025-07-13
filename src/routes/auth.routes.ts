import { Router } from 'express';
import { authService } from '@/services/auth.service.js';
import { authMiddleware } from '@/middleware/auth.middleware.js';

const router = Router();

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const result = await authService.register(email, password, name);
    
    // Set secure HTTP-only cookie
    res.cookie('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // true in production
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      path: '/'
    });
    
    res.status(201).json({ user: result.user });
  } catch (error) {
    console.error('\n[Auth Route Error]\n', error, '\n');
    res.status(400).json({ error: (error as Error).message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const result = await authService.login(email, password);
    
    // Set secure HTTP-only cookie
    res.cookie('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // true in production
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      path: '/'
    });
    
    res.json({ user: result.user });
  } catch (error) {
    console.error('\n[Auth Route Error]\n', error, '\n');
    res.status(401).json({ error: (error as Error).message });
  }
});

// Logout user
router.post('/logout', (req, res) => {
  // Clear the token cookie
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/'
  });
  
  res.json({ message: 'Logged out successfully' });
});

// Get current user profile (requires authentication)
router.get('/profile', authMiddleware.authenticate, (req, res) => {
  res.json({ user: req.user });
});

// Get full user profile with user object
router.get('/profile/full', authMiddleware.getUser, (req, res) => {
  res.json({ user: req.user });
});

// Update user profile (requires authentication)
router.put('/profile', authMiddleware.authenticate, async (req, res) => {
  try {
    const { name, email } = req.body;
    const userId = req.user.userId;
    
    // Add your user update logic here
    // const updatedUser = await userModel.update(userId, { name, email });
    
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('\n[Auth Route Error]\n', error, '\n');
    res.status(400).json({ error: (error as Error).message });
  }
});

export default router; 