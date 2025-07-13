import { Readable } from 'stream';

export interface FileInfo {
  name: string;
  type: 'file' | 'folder';
  size?: number;
  lastModified?: Date;
  path: string;
}

export interface UploadResult {
  success: boolean;
  uploaded: string[];
  errors?: string[];
}

export interface StorageConfig {
  [key: string]: any;
}

export interface StorageBackendConfig {
  backend: 'LOCAL' | 'S3' | 'R2' | 'WASABI';
  name: string;
  enabled: boolean;
  config?: StorageConfig;
}

export abstract class BaseStorageAdapter {
  protected config: StorageConfig;
  protected userHomeDirectory: string;

  constructor(config: StorageConfig, userHomeDirectory: string) {
    this.config = config;
    this.userHomeDirectory = userHomeDirectory;
  }

  // Core file operations
  abstract listFiles(relativePath: string): Promise<{ files: string[], folders: string[] }>;
  abstract uploadFiles(files: Express.Multer.File[], relativePath: string): Promise<UploadResult>;
  abstract createFolder(folderName: string, relativePath: string): Promise<boolean>;
  abstract deleteFile(filePath: string): Promise<boolean>;
  abstract deleteFolder(folderPath: string): Promise<boolean>;
  abstract moveFile(sourcePath: string, destinationPath: string): Promise<boolean>;
  abstract moveFolder(sourcePath: string, destinationPath: string): Promise<boolean>;
  abstract downloadFile(filePath: string): Promise<Readable>;
  abstract getFileInfo(filePath: string): Promise<FileInfo | null>;

  // Utility methods
  protected validatePath(path: string): boolean {
    return !path.includes('..') && !path.includes('//');
  }

  protected getFullPath(relativePath: string): string {
    return relativePath ? `${this.userHomeDirectory}/${relativePath}` : this.userHomeDirectory;
  }

  protected sanitizeFileName(fileName: string): string {
    return fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  }

  // Health check
  abstract healthCheck(): Promise<boolean>;

  // Initialize storage (create buckets, folders, etc.)
  abstract initialize(): Promise<boolean>;
} 