import { getDatabase } from '@/database/connection.js';

export interface StorageBackend {
  id: number;
  backend_type: 'LOCAL' | 'S3' | 'R2' | 'WASABI';
  name: string;
  enabled: number; // SQLite returns 0 or 1
  is_current: number; // SQLite returns 0 or 1
  config: string; // JSON string
  created_at: string;
  updated_at: string;
}

export const storageModel = {
  // Get all storage backends
  getAll: () => {
    const db = getDatabase();
    const stmt = db.prepare('SELECT * FROM storage_backends ORDER BY id');
    return stmt.all() as StorageBackend[];
  },

  // Get current storage backend
  getCurrent: () => {
    const db = getDatabase();
    const stmt = db.prepare('SELECT * FROM storage_backends WHERE is_current = 1');
    return stmt.get() as StorageBackend | undefined;
  },

  // Get storage backend by type
  getByType: (backendType: 'LOCAL' | 'S3' | 'R2' | 'WASABI') => {
    const db = getDatabase();
    const stmt = db.prepare('SELECT * FROM storage_backends WHERE backend_type = ?');
    return stmt.get(backendType) as StorageBackend | undefined;
  },

  // Set current storage backend
  setCurrent: (backendType: 'LOCAL' | 'S3' | 'R2' | 'WASABI') => {
    const db = getDatabase();
    // Set all backends to not current and not enabled
    db.prepare('UPDATE storage_backends SET is_current = 0, enabled = 0').run();
    // Set the specified backend as current and enabled
    const stmt = db.prepare('UPDATE storage_backends SET is_current = 1, enabled = 1 WHERE backend_type = ?');
    return stmt.run(backendType);
  },

  // Update storage backend configuration
  updateConfig: (backendType: 'LOCAL' | 'S3' | 'R2' | 'WASABI', config: Record<string, any>) => {
    const db = getDatabase();
    const configJson = JSON.stringify(config);
    const stmt = db.prepare(`
      UPDATE storage_backends 
      SET config = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE backend_type = ?
    `);
    return stmt.run(configJson, backendType);
  },

  // Toggle storage backend enabled status
  toggleEnabled: (backendType: 'LOCAL' | 'S3' | 'R2' | 'WASABI') => {
    const db = getDatabase();
    const stmt = db.prepare(`
      UPDATE storage_backends 
      SET enabled = CASE WHEN enabled = 1 THEN 0 ELSE 1 END, 
          updated_at = CURRENT_TIMESTAMP 
      WHERE backend_type = ?
    `);
    return stmt.run(backendType);
  },

  // Update storage backend name
  updateName: (backendType: 'LOCAL' | 'S3' | 'R2' | 'WASABI', name: string) => {
    const db = getDatabase();
    const stmt = db.prepare(`
      UPDATE storage_backends 
      SET name = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE backend_type = ?
    `);
    return stmt.run(name, backendType);
  },

  // Get storage backend by ID
  getById: (id: number) => {
    const db = getDatabase();
    const stmt = db.prepare('SELECT * FROM storage_backends WHERE id = ?');
    return stmt.get(id) as StorageBackend | undefined;
  }
}; 