import { Router } from 'express';
import { authMiddleware } from '@/middleware/auth.middleware.js';
import { userModel } from '@/models/user.model.js';
import { getDatabase, createDatabase, getFileDirectory, ensureFileDirectory } from '@/database/connection.js';
import { storageManager } from '@/services/storage.js';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { toFolderName } from '@/utils/random-string.util.js';
import { UPLOADS_BASE_DIR } from '@/constants/app-constants.constants.js';

const router = Router();


// Setup status endpoint
router.get('/setup-status', (_, res) => {
  const setupComplete = userModel.isSetupComplete();
  res.json({ setupComplete });
});

// Complete platform setup (create first admin)
router.post('/setup', async (req, res) => {
  try {
    const { adminEmail, password, adminName } = req.body;
    if (!adminEmail || !password || !adminName) {
      return res.status(400).json({ error: 'Admin email, password, and name are required' });
    }
    // Generate home directory from admin name
    const folderName = toFolderName(adminName);
    if (!folderName) {
      return res.status(400).json({ error: 'Invalid admin name for folder' });
    }
    const homeDirectory = `${UPLOADS_BASE_DIR}/${folderName}`;
    // Validate home directory name
    if (!/^uploads\/[a-z0-9-_]+$/.test(homeDirectory)) {
      return res.status(400).json({ error: 'Home directory can only contain letters, numbers, hyphens, and underscores' });
    }
    if (userModel.isSetupComplete()) {
      return res.status(400).json({ error: 'Platform setup is already complete' });
    }
    createDatabase();
    const result = await userModel.create(adminEmail, password, adminName, 'admin', homeDirectory);
    ensureFileDirectory(homeDirectory);
    res.status(201).json({
      success: true,
      message: 'Platform setup completed successfully',
      data: { id: result.lastInsertRowid, homeDirectory }
    });
  } catch (error) {
    console.error('\n[Platform Route Error]\n', error, '\n');
    res.status(400).json({ error: (error as Error).message });
  }
});

// File management (shared storage for all users)
// Multer setup for file uploads
const upload = multer({ dest: path.join(process.cwd(), 'tmp_uploads') });

// List files and folders in a directory
router.get('/files', authMiddleware.authenticate, async (req, res) => {
  try {
    const { user: { userId } } = req;
    const relPath = req.query.path ? String(req.query.path) : '';
    
    if (relPath.includes('..')) {
      return res.status(400).json({ error: 'Invalid path' });
    }

    const result = await storageManager.listFiles(userId, relPath);
    res.json({ files: result.files, folders: result.folders, path: relPath });
  } catch (error) {
    console.error('\n[Platform Route Error]\n', error, '\n');
    res.status(500).json({ error: (error as Error).message });
  }
});

// Upload files to a directory
router.post('/files/upload', authMiddleware.authenticate, upload.array('files'), async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const relPath = req.query.path ? String(req.query.path) : '';
    
    if (relPath.includes('..')) {
      return res.status(400).json({ error: 'Invalid path' });
    }

    const files = req.files as Express.Multer.File[];
    const result = await storageManager.uploadFiles(userId, files, relPath);
    res.json(result);
  } catch (error) {
    console.error('\n[Platform Route Error]\n', error, '\n');
    res.status(500).json({ error: (error as Error).message });
  }
});

// Create a new folder
router.post('/files/folder', authMiddleware.authenticate, async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const { path: relPath, name } = req.body;
    
    if (!name || !/^[a-zA-Z0-9-_ ]+$/.test(name)) {
      return res.status(400).json({ error: 'Invalid folder name' });
    }
    
    if ((relPath || '').includes('..')) {
      return res.status(400).json({ error: 'Invalid path' });
    }
    
    await storageManager.createFolder(userId, name, relPath || '');
    res.json({ success: true, folder: name });
  } catch (error) {
    console.error('\n[Platform Route Error]\n', error, '\n');
    res.status(500).json({ error: (error as Error).message });
  }
});

// Delete file or folder
router.delete('/files', authMiddleware.authenticate, async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const { path: relPath } = req.query;
    
    if (!relPath || String(relPath).includes('..')) {
      return res.status(400).json({ error: 'Invalid path' });
    }
    
    const filePath = String(relPath);
    const fileInfo = await storageManager.getFileInfo(userId, filePath);
    
    if (!fileInfo) {
      return res.status(404).json({ error: 'File or folder not found' });
    }
    
    if (fileInfo.type === 'folder') {
      await storageManager.deleteFolder(userId, filePath);
    } else {
      await storageManager.deleteFile(userId, filePath);
    }
    
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    console.error('\n[Platform Route Error]\n', error, '\n');
    res.status(500).json({ error: (error as Error).message });
  }
});

// Move file or folder
router.put('/files/move', authMiddleware.authenticate, async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const { sourcePath, destinationPath } = req.body;
    
    if (!sourcePath || !destinationPath) {
      return res.status(400).json({ error: 'Source and destination paths are required' });
    }
    
    if (sourcePath.includes('..') || destinationPath.includes('..')) {
      return res.status(400).json({ error: 'Invalid path' });
    }
    
    const fileInfo = await storageManager.getFileInfo(userId, sourcePath);
    
    if (!fileInfo) {
      return res.status(404).json({ error: 'Source file or folder not found' });
    }
    
    if (fileInfo.type === 'folder') {
      await storageManager.moveFolder(userId, sourcePath, destinationPath);
    } else {
      await storageManager.moveFile(userId, sourcePath, destinationPath);
    }
    
    res.json({ success: true, message: 'Moved successfully' });
  } catch (error) {
    console.error('\n[Platform Route Error]\n', error, '\n');
    res.status(500).json({ error: (error as Error).message });
  }
});

// Download file
router.get('/files/download', authMiddleware.authenticate, async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const { path: filePath } = req.query;
    
    if (!filePath || String(filePath).includes('..')) {
      return res.status(400).json({ error: 'Invalid path' });
    }
    
    const fileInfo = await storageManager.getFileInfo(userId, String(filePath));
    
    if (!fileInfo || fileInfo.type === 'folder') {
      return res.status(404).json({ error: 'File not found' });
    }
    
    const fileStream = await storageManager.downloadFile(userId, String(filePath));
    
    res.setHeader('Content-Disposition', `attachment; filename="${fileInfo.name}"`);
    res.setHeader('Content-Type', 'application/octet-stream');
    
    fileStream.pipe(res);
  } catch (error) {
    console.error('\n[Platform Route Error]\n', error, '\n');
    res.status(500).json({ error: (error as Error).message });
  }
});

// User management endpoints (admin only)
router.post('/users', authMiddleware.authenticate, async (req, res) => {
  try {
    const adminId = (req as any).user.userId;
    if (!userModel.isAdmin(adminId)) {
      return res.status(403).json({ error: 'Admin access required' });
    }
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }
    // Generate user folder name from full name
    const folderName = toFolderName(name);
    if (!folderName) {
      return res.status(400).json({ error: 'Invalid name for folder' });
    }
    const homeDirectory = `${UPLOADS_BASE_DIR}/${folderName}`;
    // Validate home directory name
    if (!/^uploads\/[a-z0-9-_]+$/.test(homeDirectory)) {
      return res.status(400).json({ error: 'Home directory can only contain letters, numbers, hyphens, and underscores' });
    }
    // Create the user's folder
    ensureFileDirectory(homeDirectory);
    const result = await userModel.create(email, password, name, 'user', homeDirectory);
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: { id: result.lastInsertRowid, homeDirectory }
    });
  } catch (error) {
    console.error('\n[Platform Route Error]\n', error, '\n');
    res.status(400).json({ error: (error as Error).message });
  }
});

// Get all users (admin only)
router.get('/users', authMiddleware.authenticate, (req, res) => {
  try {
    const adminId = (req as any).user.userId;
    
    // Check if user is admin
    if (!userModel.isAdmin(adminId)) {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    const users = userModel.getAllUsers();
    res.json({ users });
  } catch (error) {
    console.error('\n[Platform Route Error]\n', error, '\n');
    res.status(500).json({ error: 'Failed to get users' });
  }
});

// Delete user (admin only)
router.delete('/users/:userId', authMiddleware.authenticate, async (req, res) => {
  try {
    const adminId = (req as any).user.userId;
    const userId = parseInt(req.params.userId);
    
    // Check if user is admin
    if (!userModel.isAdmin(adminId)) {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    // Prevent admin from deleting themselves
    if (adminId === userId) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }
    
    const user = userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Prevent deleting the last admin
    if (user.role === 'admin') {
      const adminCount = userModel.getAllUsers().filter(u => u.role === 'admin').length;
      if (adminCount <= 1) {
        return res.status(400).json({ error: 'Cannot delete the last admin user' });
      }
    }
    
    const db = getDatabase();
    const stmt = db.prepare('DELETE FROM users WHERE id = ?');
    stmt.run(userId);
    
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('\n[Platform Route Error]\n', error, '\n');
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router; 