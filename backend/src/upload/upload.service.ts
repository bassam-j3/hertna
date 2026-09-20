import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { StorageService } from './storage/storage.interface';
import type { StrictUploadedFile } from './interfaces/uploaded-file.interface';
import type { UploadResult } from './interfaces/upload-result.interface';

import * as path from 'path';
import * as crypto from 'crypto';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);

  constructor(private readonly storageService: StorageService) {}

  async uploadFile(file: StrictUploadedFile, bucket: string, pathPrefix: string = ''): Promise<UploadResult> {
    try {
      const ext = path.extname(file.originalname).toLowerCase().replace(/[^a-z0-9.]/g, '');
      const filename = `${crypto.randomUUID()}${ext || '.bin'}`;
      const destinationKey = path.posix.join(pathPrefix, filename);

      const url = await this.storageService.upload(file.buffer, bucket, destinationKey, file.mimetype);

      return {
        url,
        filename,
        mimetype: file.mimetype,
        size: file.size,
      };
    } catch (error: any) {
      this.logger.error(`Could not upload file to bucket ${bucket}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Could not upload file');
    }
  }
}
