import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';
import { BaseStorageAdapter, UploadResult, FileInfo } from './base.adapter.js';

export class LocalStorageAdapter extends BaseStorageAdapter {
  private basePath: string;

  constructor(config: any, userHomeDirectory: string) {
    super(config, userHomeDirectory);
    this.basePath = config.basePath || path.join(process.cwd());
  }

  async listFiles(relativePath: string): Promise<{ files: string[], folders: string[] }> {
    if (!this.validatePath(relativePath)) {
      throw new Error('Invalid path');
    }

    const fullPath = path.join(this.basePath, this.getFullPath(relativePath));
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }

    const entries = fs.readdirSync(fullPath, { withFileTypes: true });
    const files = entries.filter(e => e.isFile()).map(e => e.name);
    const folders = entries.filter(e => e.isDirectory()).map(e => e.name);

    return { files, folders };
  }

  async uploadFiles(files: Express.Multer.File[], relativePath: string): Promise<UploadResult> {
    if (!this.validatePath(relativePath)) {
      throw new Error('Invalid path');
    }

    const fullPath = path.join(this.basePath, this.getFullPath(relativePath));
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }

    const uploaded: string[] = [];
    const errors: string[] = [];

    for (const file of files) {
      try {
        const destPath = path.join(fullPath, this.sanitizeFileName(file.originalname));
        fs.renameSync(file.path, destPath);
        uploaded.push(file.originalname);
      } catch (error) {
        errors.push(`Failed to upload ${file.originalname}: ${error}`);
      }
    }

    return {
      success: uploaded.length > 0,
      uploaded,
      errors: errors.length > 0 ? errors : undefined
    };
  }

  async createFolder(folderName: string, relativePath: string): Promise<boolean> {
    if (!this.validatePath(relativePath)) {
      throw new Error('Invalid path');
    }

    if (!/^[a-zA-Z0-9-_ ]+$/.test(folderName)) {
      throw new Error('Invalid folder name');
    }

    const fullPath = path.join(this.basePath, this.getFullPath(relativePath), folderName);
    
    if (fs.existsSync(fullPath)) {
      throw new Error('Folder already exists');
    }

    fs.mkdirSync(fullPath, { recursive: true });
    return true;
  }

  async deleteFile(filePath: string): Promise<boolean> {
    if (!this.validatePath(filePath)) {
      throw new Error('Invalid path');
    }

    const fullPath = path.join(this.basePath, this.getFullPath(filePath));
    
    if (!fs.existsSync(fullPath)) {
      throw new Error('File not found');
    }

    const stats = fs.statSync(fullPath);
    if (stats.isDirectory()) {
      throw new Error('Path is a directory, use deleteFolder instead');
    }

    fs.unlinkSync(fullPath);
    return true;
  }

  async deleteFolder(folderPath: string): Promise<boolean> {
    if (!this.validatePath(folderPath)) {
      throw new Error('Invalid path');
    }

    const fullPath = path.join(this.basePath, this.getFullPath(folderPath));
    
    if (!fs.existsSync(fullPath)) {
      throw new Error('Folder not found');
    }

    const stats = fs.statSync(fullPath);
    if (!stats.isDirectory()) {
      throw new Error('Path is a file, use deleteFile instead');
    }

    fs.rmSync(fullPath, { recursive: true, force: true });
    return true;
  }

  async moveFile(sourcePath: string, destinationPath: string): Promise<boolean> {
    if (!this.validatePath(sourcePath) || !this.validatePath(destinationPath)) {
      throw new Error('Invalid path');
    }

    const sourceFullPath = path.join(this.basePath, this.getFullPath(sourcePath));
    const destFullPath = path.join(this.basePath, this.getFullPath(destinationPath));
    
    if (!fs.existsSync(sourceFullPath)) {
      throw new Error('Source file not found');
    }

    const sourceStats = fs.statSync(sourceFullPath);
    if (sourceStats.isDirectory()) {
      throw new Error('Source is a directory, use moveFolder instead');
    }

    // Ensure destination directory exists
    const destDir = path.dirname(destFullPath);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    fs.renameSync(sourceFullPath, destFullPath);
    return true;
  }

  async moveFolder(sourcePath: string, destinationPath: string): Promise<boolean> {
    if (!this.validatePath(sourcePath) || !this.validatePath(destinationPath)) {
      throw new Error('Invalid path');
    }

    const sourceFullPath = path.join(this.basePath, this.getFullPath(sourcePath));
    const destFullPath = path.join(this.basePath, this.getFullPath(destinationPath));
    
    if (!fs.existsSync(sourceFullPath)) {
      throw new Error('Source folder not found');
    }

    const sourceStats = fs.statSync(sourceFullPath);
    if (!sourceStats.isDirectory()) {
      throw new Error('Source is a file, use moveFile instead');
    }

    // Ensure destination directory exists
    const destDir = path.dirname(destFullPath);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    fs.renameSync(sourceFullPath, destFullPath);
    return true;
  }

  async downloadFile(filePath: string): Promise<Readable> {
    if (!this.validatePath(filePath)) {
      throw new Error('Invalid path');
    }

    const fullPath = path.join(this.basePath, this.getFullPath(filePath));
    
    if (!fs.existsSync(fullPath)) {
      throw new Error('File not found');
    }

    const stats = fs.statSync(fullPath);
    if (stats.isDirectory()) {
      throw new Error('Path is a directory');
    }

    return fs.createReadStream(fullPath);
  }

  async getFileInfo(filePath: string): Promise<FileInfo | null> {
    if (!this.validatePath(filePath)) {
      throw new Error('Invalid path');
    }

    const fullPath = path.join(this.basePath, this.getFullPath(filePath));
    
    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const stats = fs.statSync(fullPath);
    const fileName = path.basename(fullPath);

    return {
      name: fileName,
      type: stats.isDirectory() ? 'folder' : 'file',
      size: stats.isFile() ? stats.size : undefined,
      lastModified: stats.mtime,
      path: filePath
    };
  }

  async healthCheck(): Promise<boolean> {
    try {
      const fullPath = path.join(this.basePath, this.userHomeDirectory);
      return fs.existsSync(fullPath);
    } catch {
      return false;
    }
  }

  async initialize(): Promise<boolean> {
    try {
      const fullPath = path.join(this.basePath, this.userHomeDirectory);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
      }
      return true;
    } catch {
      return false;
    }
  }
} 