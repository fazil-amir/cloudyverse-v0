import { Router } from 'express';
import { storageService } from '@/services/storage.service.js';
import { authMiddleware } from '@/middleware/auth.middleware.js';

const router = Router();

// Get all storage backends
router.get('/backends', authMiddleware.authenticate, (req, res) => {
  try {
    const backends = storageService.getAllBackends();
    res.json({ backends });
  } catch (error) {
    console.error('\n[Storage Route Error]\n', error, '\n');
    res.status(500).json({ error: 'Failed to get storage backends' });
  }
});

// Get current storage backend
router.get('/backends/current', authMiddleware.authenticate, (req, res) => {
  try {
    const backend = storageService.getCurrentBackend();
    res.json({ backend });
  } catch (error) {
    console.error('\n[Storage Route Error]\n', error, '\n');
    res.status(500).json({ error: 'Failed to get current storage backend' });
  }
});

// Set current storage backend
router.put('/backends/current', authMiddleware.authenticate, (req, res) => {
  try {
    const { backendType } = req.body;
    
    if (!backendType || !['LOCAL', 'S3', 'R2'].includes(backendType)) {
      return res.status(400).json({ error: 'Valid backend type is required (LOCAL, S3, R2)' });
    }

    storageService.setCurrentBackend(backendType);
    res.json({ message: `Storage backend switched to ${backendType}` });
  } catch (error) {
    console.error('\n[Storage Route Error]\n', error, '\n');
    res.status(500).json({ error: 'Failed to set current storage backend' });
  }
});

// Update storage backend configuration
router.put('/backends/:backendType/config', authMiddleware.authenticate, (req, res) => {
  try {
    const { backendType } = req.params;
    const config = req.body;
    
    if (!['LOCAL', 'S3', 'R2'].includes(backendType)) {
      return res.status(400).json({ error: 'Valid backend type is required (LOCAL, S3, R2)' });
    }

    storageService.updateBackendConfig(backendType as 'LOCAL' | 'S3' | 'R2', config);
    res.json({ message: `${backendType} configuration updated successfully` });
  } catch (error) {
    console.error('\n[Storage Route Error]\n', error, '\n');
    res.status(500).json({ error: 'Failed to update storage backend configuration' });
  }
});

// Toggle storage backend enabled status
router.put('/backends/:backendType/toggle', authMiddleware.authenticate, (req, res) => {
  try {
    const { backendType } = req.params;
    
    if (!['LOCAL', 'S3', 'R2'].includes(backendType)) {
      return res.status(400).json({ error: 'Valid backend type is required (LOCAL, S3, R2)' });
    }

    storageService.toggleBackend(backendType as 'LOCAL' | 'S3' | 'R2');
    res.json({ message: `${backendType} enabled status toggled successfully` });
  } catch (error) {
    console.error('\n[Storage Route Error]\n', error, '\n');
    res.status(500).json({ error: 'Failed to toggle storage backend' });
  }
});

// Get storage backend by type
router.get('/backends/:backendType', authMiddleware.authenticate, (req, res) => {
  try {
    const { backendType } = req.params;
    
    if (!['LOCAL', 'S3', 'R2'].includes(backendType)) {
      return res.status(400).json({ error: 'Valid backend type is required (LOCAL, S3, R2)' });
    }

    const backend = storageService.getBackendByType(backendType as 'LOCAL' | 'S3' | 'R2');
    if (!backend) {
      return res.status(404).json({ error: 'Storage backend not found' });
    }

    res.json({ backend });
  } catch (error) {
    console.error('\n[Storage Route Error]\n', error, '\n');
    res.status(500).json({ error: 'Failed to get storage backend' });
  }
});

export default router; 