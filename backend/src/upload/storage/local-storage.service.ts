import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { StorageService } from './storage.interface';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LocalStorageService implements StorageService, OnModuleInit {
  private readonly uploadDir = path.join(process.cwd(), 'uploads');
  private readonly logger = new Logger(LocalStorageService.name);

  async onModuleInit() {
    await this.ensureDirectoryExists();
  }

  private async ensureDirectoryExists() {
    try {
      await fs.promises.access(this.uploadDir);
    } catch {
      await fs.promises.mkdir(this.uploadDir, { recursive: true });
    }
  }

  async upload(fileBuffer: Buffer, bucket: string, destinationKey: string, mimetype: string): Promise<string> {
    const resolvedBase = path.resolve(this.uploadDir);
    const filePath = path.resolve(this.uploadDir, bucket, destinationKey);

    if (!filePath.startsWith(resolvedBase)) {
      throw new Error('Invalid file path: path traversal detected');
    }

    try {
      const dir = path.dirname(filePath);
      await fs.promises.mkdir(dir, { recursive: true });
      await fs.promises.writeFile(filePath, fileBuffer);
      // Return a URL path that includes the bucket and destinationKey
      // Ensure we format it correctly for URLs
      return `/uploads/${bucket}/${destinationKey.replace(/\\/g, '/')}`;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to save file locally: ${message}`);
      throw new Error('Failed to save file locally');
    }
  }
}
