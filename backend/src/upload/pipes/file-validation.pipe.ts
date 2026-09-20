import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import type { StrictUploadedFile } from '../interfaces/uploaded-file.interface';
import type { FileValidationOptions } from '../interfaces/file-validation-options.interface';

const KNOWN_SIGNATURES: Record<string, (b: Buffer) => boolean> = {
  'image/jpeg': (buffer: Buffer) => buffer.length >= 3 && buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF,
  'image/png': (buffer: Buffer) => buffer.length >= 4 && buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47,
  'image/webp': (buffer: Buffer) => buffer.length >= 12 && 
      buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 &&
      buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50
};

@Injectable()
export class FileValidationPipe implements PipeTransform<any, StrictUploadedFile> {
  constructor(private readonly options: FileValidationOptions) {}

  transform(value: any): StrictUploadedFile {
    if (!value) {
      throw new BadRequestException('File is required');
    }

    if (!value.buffer || !value.originalname || !value.mimetype || value.size === undefined) {
      throw new BadRequestException('Invalid file upload format');
    }

    const file = value as StrictUploadedFile;

    if (!this.options.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(`Invalid file type. Allowed types: ${this.options.allowedMimeTypes.join(', ')}`);
    }

    if (file.size > this.options.maxSizeBytes) {
      throw new BadRequestException(`File size exceeds limit of ${this.options.maxSizeBytes} bytes`);
    }

    if (file.buffer.length > this.options.maxSizeBytes) {
      throw new BadRequestException(`File buffer size exceeds limit of ${this.options.maxSizeBytes} bytes`);
    }

    const checker = KNOWN_SIGNATURES[file.mimetype];
    if (checker) {
      if (!checker(file.buffer)) {
        throw new BadRequestException('File content does not match reported MIME type (spoofing detected)');
      }
    }

    return file;
  }
}


