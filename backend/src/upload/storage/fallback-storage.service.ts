import { Logger } from '@nestjs/common';
import { StorageService } from './storage.interface';

export class FallbackStorageService implements StorageService {
  private readonly logger = new Logger(FallbackStorageService.name);

  constructor(
    private readonly primary: StorageService,
    private readonly fallback: StorageService,
  ) {}

  async upload(fileBuffer: Buffer, bucket: string, destinationKey: string, mimetype: string): Promise<string> {
    try {
      return await this.primary.upload(fileBuffer, bucket, destinationKey, mimetype);
    } catch (error: any) {
      this.logger.warn(`Primary storage failed, falling back to secondary: ${error.message}`);
      return await this.fallback.upload(fileBuffer, bucket, destinationKey, mimetype);
    }
  }
}
