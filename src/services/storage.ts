import { storageService as platformService } from './platform-service.js';
import { StorageAdapterFactory, StorageBackendType } from '@/adapters/factory.js';
import { BaseStorageAdapter } from '@/adapters/base.adapter.js';
import { userModel } from '@/models/user.model.js';

export class StorageService {
  private static instance: StorageService;

  private constructor() {}

  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  private async getCurrentAdapter(userId: number): Promise<BaseStorageAdapter> {
    // Get current storage backend configuration
    const currentBackend = platformService.getCurrentBackend();
    if (!currentBackend) {
      throw new Error('No storage backend configured');
    }

    // Get user's home directory
    const user = userModel.findById(userId);
    if (!user || !user.home_directory) {
      throw new Error('User home directory not found');
    }

    // Always create a new adapter for each operation
    return StorageAdapterFactory.createAdapter(
      currentBackend.backend as StorageBackendType,
      currentBackend.config || {},
      user.home_directory
    );
  }

  async listFiles(userId: number, relativePath: string) {
    const adapter = await this.getCurrentAdapter(userId);
    // Ensure storage is initialized
    await adapter.initialize();
    return adapter.listFiles(relativePath);
  }

  async uploadFiles(userId: number, files: Express.Multer.File[], relativePath: string) {
    const adapter = await this.getCurrentAdapter(userId);
    // Ensure storage is initialized
    await adapter.initialize();
    return adapter.uploadFiles(files, relativePath);
  }

  async createFolder(userId: number, folderName: string, relativePath: string) {
    const adapter = await this.getCurrentAdapter(userId);
    return adapter.createFolder(folderName, relativePath);
  }

  async deleteFile(userId: number, filePath: string) {
    const adapter = await this.getCurrentAdapter(userId);
    return adapter.deleteFile(filePath);
  }

  async deleteFolder(userId: number, folderPath: string) {
    const adapter = await this.getCurrentAdapter(userId);
    return adapter.deleteFolder(folderPath);
  }

  async moveFile(userId: number, sourcePath: string, destinationPath: string) {
    const adapter = await this.getCurrentAdapter(userId);
    return adapter.moveFile(sourcePath, destinationPath);
  }

  async moveFolder(userId: number, sourcePath: string, destinationPath: string) {
    const adapter = await this.getCurrentAdapter(userId);
    return adapter.moveFolder(sourcePath, destinationPath);
  }

  async downloadFile(userId: number, filePath: string) {
    const adapter = await this.getCurrentAdapter(userId);
    return adapter.downloadFile(filePath);
  }

  async getFileInfo(userId: number, filePath: string) {
    const adapter = await this.getCurrentAdapter(userId);
    return adapter.getFileInfo(filePath);
  }

  async healthCheck(userId: number) {
    const adapter = await this.getCurrentAdapter(userId);
    return adapter.healthCheck();
  }

  async initialize(userId: number) {
    const adapter = await this.getCurrentAdapter(userId);
    return adapter.initialize();
  }
}

export const storageManager = StorageService.getInstance(); 