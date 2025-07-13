import { storageModel } from '@/models/storage.model.js';

export interface StorageBackendConfig {
  backend: 'LOCAL' | 'S3' | 'R2' | 'WASABI';
  name: string;
  enabled: boolean;
  config?: Record<string, any>;
}

export const storageService = {
  // Get all storage backends
  getAllBackends: () => {
    try {
      const backends = storageModel.getAll();
      return backends.map(backend => ({
        backend: backend.backend_type,
        name: backend.name,
        enabled: Boolean(backend.enabled),
        isCurrent: Boolean(backend.is_current),
        config: backend.config ? JSON.parse(backend.config) : {}
      }));
    } catch (error) {
      console.error('\n[Storage Service Error]\n', error, '\n');
      throw new Error('Failed to get all storage backends.');
    }
  },

  // Get current storage backend
  getCurrentBackend: () => {
    try {
      const backend = storageModel.getCurrent();
      if (!backend) return null;

      return {
        backend: backend.backend_type,
        name: backend.name,
        enabled: Boolean(backend.enabled),
        isCurrent: Boolean(backend.is_current),
        config: backend.config ? JSON.parse(backend.config) : {}
      };
    } catch (error) {
      console.error('\n[Storage Service Error]\n', error, '\n');
      throw new Error('Failed to get current storage backend.');
    }
  },

  // Set current storage backend
  setCurrentBackend: (backendType: 'LOCAL' | 'S3' | 'R2' | 'WASABI') => {
    try {
      return storageModel.setCurrent(backendType);
    } catch (error) {
      console.error('\n[Storage Service Error]\n', error, '\n');
      throw new Error('Failed to set current storage backend.');
    }
  },

  // Update storage backend configuration
  updateBackendConfig: (backendType: 'LOCAL' | 'S3' | 'R2' | 'WASABI', config: Record<string, any>) => {
    try {
      return storageModel.updateConfig(backendType, config);
    } catch (error) {
      console.error('\n[Storage Service Error]\n', error, '\n');
      throw new Error('Failed to update storage backend configuration.');
    }
  },

  // Toggle storage backend enabled status
  toggleBackend: (backendType: 'LOCAL' | 'S3' | 'R2' | 'WASABI') => {
    try {
      return storageModel.toggleEnabled(backendType);
    } catch (error) {
      console.error('\n[Storage Service Error]\n', error, '\n');
      throw new Error('Failed to toggle storage backend enabled status.');
    }
  },

  // Update storage backend name
  updateBackendName: (backendType: 'LOCAL' | 'S3' | 'R2' | 'WASABI', name: string) => {
    try {
      return storageModel.updateName(backendType, name);
    } catch (error) {
      console.error('\n[Storage Service Error]\n', error, '\n');
      throw new Error('Failed to update storage backend name.');
    }
  },

  // Get storage backend by type
  getBackendByType: (backendType: 'LOCAL' | 'S3' | 'R2' | 'WASABI') => {
    try {
      const backend = storageModel.getByType(backendType);
      if (!backend) return null;

      return {
        backend: backend.backend_type,
        name: backend.name,
        enabled: Boolean(backend.enabled),
        isCurrent: Boolean(backend.is_current),
        config: backend.config ? JSON.parse(backend.config) : {}
      };
    } catch (error) {
      console.error('\n[Storage Service Error]\n', error, '\n');
      throw new Error('Failed to get storage backend by type.');
    }
  }
}; 