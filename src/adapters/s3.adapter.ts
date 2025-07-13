import { S3Client, ListObjectsV2Command, PutObjectCommand, DeleteObjectCommand, GetObjectCommand, HeadObjectCommand, CopyObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import { BaseStorageAdapter, UploadResult, FileInfo } from './base.adapter.js';
import { createReadStream } from 'fs';
import { UPLOADS_BASE_DIR } from '@/constants/app-constants.constants.js';

export class S3StorageAdapter extends BaseStorageAdapter {
  private s3Client: S3Client;
  private bucketName: string;
  private region: string;

  constructor(config: any, userHomeDirectory: string) {
    super(config, userHomeDirectory);
    
    this.bucketName = config.bucket;
    // Default region to 'auto' if not provided (for R2 compatibility)
    this.region = config.region || 'auto';
    
    if (!this.bucketName) {
      throw new Error('S3 bucket name is required');
    }

    this.s3Client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
      endpoint: config.endpoint, // For R2, this would be the R2 endpoint
    });
  }

  private getS3Key(relativePath: string, fileName?: string): string {
    // Always use the user's home directory as the logical root
    const baseKey = relativePath ? `${this.userHomeDirectory}/${relativePath}` : this.userHomeDirectory;
    return fileName ? `${baseKey}/${fileName}` : baseKey;
  }

  async listFiles(relativePath: string): Promise<{ files: string[], folders: string[] }> {
    if (!this.validatePath(relativePath)) {
      throw new Error('Invalid path');
    }

    // At root, prefix should be 'uploads/'
    const prefix = this.getS3Key(relativePath);
    const delimiter = '/';

    try {
      const command = new ListObjectsV2Command({
        Bucket: this.bucketName,
        Prefix: prefix.endsWith('/') ? prefix : prefix + '/',
        Delimiter: delimiter,
      });

      const response = await this.s3Client.send(command);

      // Debug log
      console.log('S3 List Response:', {
        Prefix: prefix,
        Contents: response.Contents?.map(obj => obj.Key),
        CommonPrefixes: response.CommonPrefixes?.map(cp => cp.Prefix)
      });

      const files: string[] = [];
      const folders: Set<string> = new Set();

      // Folders from CommonPrefixes
      if (response.CommonPrefixes) {
        for (const commonPrefix of response.CommonPrefixes) {
          if (commonPrefix.Prefix) {
            let folderName = commonPrefix.Prefix.replace(prefix.endsWith('/') ? prefix : prefix + '/', '').replace(/\/$/, '');
            if (folderName) folders.add(folderName);
          }
        }
      }

      // Folders from marker objects (keys ending with '/')
      if (response.Contents) {
        for (const object of response.Contents) {
          if (object.Key && object.Key !== prefix) {
            const fileName = object.Key.replace(prefix.endsWith('/') ? prefix : prefix + '/', '');
            if (fileName.endsWith('/')) {
              folders.add(fileName.replace(/\/$/, ''));
            } else if (fileName && !fileName.includes('/')) {
              files.push(fileName);
            }
          }
        }
      }

      return { files, folders: Array.from(folders) };
    } catch (error) {
      throw new Error(`Failed to list files: ${error}`);
    }
  }

  async uploadFiles(files: Express.Multer.File[], relativePath: string): Promise<UploadResult> {
    if (!this.validatePath(relativePath)) {
      throw new Error('Invalid path');
    }

    const uploaded: string[] = [];
    const errors: string[] = [];

    for (const file of files) {
      try {
        const key = this.getS3Key(relativePath, this.sanitizeFileName(file.originalname));
        
        const command = new PutObjectCommand({
          Bucket: this.bucketName,
          Key: key,
          Body: createReadStream(file.path),
          ContentType: file.mimetype,
        });

        await this.s3Client.send(command);
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

    const key = this.getS3Key(relativePath, folderName) + '/';

    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: '', // Empty body for folder marker
      });

      await this.s3Client.send(command);
      return true;
    } catch (error) {
      throw new Error(`Failed to create folder: ${error}`);
    }
  }

  async deleteFile(filePath: string): Promise<boolean> {
    if (!this.validatePath(filePath)) {
      throw new Error('Invalid path');
    }

    const key = this.getS3Key(filePath);

    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.s3Client.send(command);
      return true;
    } catch (error) {
      throw new Error(`Failed to delete file: ${error}`);
    }
  }

  async deleteFolder(folderPath: string): Promise<boolean> {
    if (!this.validatePath(folderPath)) {
      throw new Error('Invalid path');
    }

    const prefix = this.getS3Key(folderPath);

    try {
      // List all objects in the folder
      const listCommand = new ListObjectsV2Command({
        Bucket: this.bucketName,
        Prefix: prefix,
      });

      const response = await this.s3Client.send(listCommand);
      
      if (response.Contents) {
        // Delete all objects in the folder
        for (const object of response.Contents) {
          if (object.Key) {
            const deleteCommand = new DeleteObjectCommand({
              Bucket: this.bucketName,
              Key: object.Key,
            });
            await this.s3Client.send(deleteCommand);
          }
        }
      }

      return true;
    } catch (error) {
      throw new Error(`Failed to delete folder: ${error}`);
    }
  }

  async moveFile(sourcePath: string, destinationPath: string): Promise<boolean> {
    if (!this.validatePath(sourcePath) || !this.validatePath(destinationPath)) {
      throw new Error('Invalid path');
    }

    const sourceKey = this.getS3Key(sourcePath);
    const destKey = this.getS3Key(destinationPath);

    try {
      // Copy to new location
      const copyCommand = new CopyObjectCommand({
        Bucket: this.bucketName,
        Key: destKey,
        CopySource: `${this.bucketName}/${sourceKey}`,
      });

      await this.s3Client.send(copyCommand);

      // Delete from old location
      const deleteCommand = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: sourceKey,
      });

      await this.s3Client.send(deleteCommand);
      return true;
    } catch (error) {
      throw new Error(`Failed to move file: ${error}`);
    }
  }

  async moveFolder(sourcePath: string, destinationPath: string): Promise<boolean> {
    if (!this.validatePath(sourcePath) || !this.validatePath(destinationPath)) {
      throw new Error('Invalid path');
    }

    const sourcePrefix = this.getS3Key(sourcePath);
    const destPrefix = this.getS3Key(destinationPath);

    try {
      // List all objects in the source folder
      const listCommand = new ListObjectsV2Command({
        Bucket: this.bucketName,
        Prefix: sourcePrefix,
      });

      const response = await this.s3Client.send(listCommand);
      
      if (response.Contents) {
        // Move all objects in the folder
        for (const object of response.Contents) {
          if (object.Key) {
            const newKey = object.Key.replace(sourcePrefix, destPrefix);
            
            // Copy to new location
            const copyCommand = new CopyObjectCommand({
              Bucket: this.bucketName,
              Key: newKey,
              CopySource: `${this.bucketName}/${object.Key}`,
            });

            await this.s3Client.send(copyCommand);

            // Delete from old location
            const deleteCommand = new DeleteObjectCommand({
              Bucket: this.bucketName,
              Key: object.Key,
            });

            await this.s3Client.send(deleteCommand);
          }
        }
      }

      return true;
    } catch (error) {
      throw new Error(`Failed to move folder: ${error}`);
    }
  }

  async downloadFile(filePath: string): Promise<Readable> {
    if (!this.validatePath(filePath)) {
      throw new Error('Invalid path');
    }

    const key = this.getS3Key(filePath);

    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const response = await this.s3Client.send(command);
      
      if (!response.Body) {
        throw new Error('File not found');
      }

      return response.Body as Readable;
    } catch (error) {
      throw new Error(`Failed to download file: ${error}`);
    }
  }

  async getFileInfo(filePath: string): Promise<FileInfo | null> {
    if (!this.validatePath(filePath)) {
      throw new Error('Invalid path');
    }

    const key = this.getS3Key(filePath);

    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const response = await this.s3Client.send(command);
      const fileName = filePath.split('/').pop() || '';

      return {
        name: fileName,
        type: 'file',
        size: response.ContentLength,
        lastModified: response.LastModified,
        path: filePath
      };
    } catch (error) {
      // Check if it's a folder by listing with prefix
      try {
        const listCommand = new ListObjectsV2Command({
          Bucket: this.bucketName,
          Prefix: key + '/',
          MaxKeys: 1,
        });

        const response = await this.s3Client.send(listCommand);
        
        if (response.Contents && response.Contents.length > 0) {
          const fileName = filePath.split('/').pop() || '';
          return {
            name: fileName,
            type: 'folder',
            path: filePath
          };
        }
      } catch {
        // Ignore folder check errors
      }

      return null;
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      const command = new ListObjectsV2Command({
        Bucket: this.bucketName,
        MaxKeys: 1,
      });

      await this.s3Client.send(command);
      return true;
    } catch {
      return false;
    }
  }

  async initialize(): Promise<boolean> {
    try {
      // Create a test object to verify bucket access
      const testKey = this.getS3Key('') + '/.test';
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: testKey,
        Body: 'test',
      });

      await this.s3Client.send(command);

      // Clean up test object
      const deleteCommand = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: testKey,
      });

      await this.s3Client.send(deleteCommand);
      return true;
    } catch {
      return false;
    }
  }
} 