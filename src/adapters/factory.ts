import { BaseStorageAdapter, StorageConfig } from './base.adapter.js';
import { LocalStorageAdapter } from './local.adapter.js';
import { S3StorageAdapter } from './s3.adapter.js';

export type StorageBackendType = 'LOCAL' | 'S3' | 'R2' | 'WASABI';

export class StorageAdapterFactory {
  static createAdapter(
    backendType: StorageBackendType,
    config: StorageConfig,
    userHomeDirectory: string
  ): BaseStorageAdapter {
    switch (backendType) {
      case 'LOCAL':
        return new LocalStorageAdapter(config, userHomeDirectory);
      
      case 'S3':
      case 'R2':
        // R2 uses the same S3 API, just with different endpoint
        if (backendType === 'R2') {
          config.endpoint = `https://${config.accountId}.r2.cloudflarestorage.com`;
        }
        return new S3StorageAdapter(config, userHomeDirectory);
      
      case 'WASABI':
        // Wasabi also uses S3 API with different endpoint
        config.endpoint = `https://s3.${config.region}.wasabisys.com`;
        return new S3StorageAdapter(config, userHomeDirectory);
      
      default:
        throw new Error(`Unsupported storage backend: ${backendType}`);
    }
  }
} 