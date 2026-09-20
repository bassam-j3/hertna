import { Test, TestingModule } from '@nestjs/testing';
import { UploadService } from './upload.service';
import { StorageService } from './storage/storage.interface';
import { InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { StrictUploadedFile } from './interfaces/uploaded-file.interface';
import { FileValidationPipe } from './pipes/file-validation.pipe';
import { LocalStorageService } from './storage/local-storage.service';
import * as fs from 'fs';

jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  existsSync: jest.fn(),
  mkdirSync: jest.fn(),
  promises: {
    writeFile: jest.fn(),
    access: jest.fn(),
    mkdir: jest.fn(),
  },
}));

describe('Upload Module Tests', () => {
  describe('UploadService', () => {
    let service: UploadService;
    let storageService: StorageService;

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          UploadService,
          {
            provide: StorageService,
            useValue: {
              upload: jest.fn(),
            },
          },
        ],
      }).compile();

      service = module.get<UploadService>(UploadService);
      storageService = module.get<StorageService>(StorageService);
    });

    describe('uploadFile', () => {
      const mockFile: StrictUploadedFile = {
        buffer: Buffer.from('test'),
        originalname: 'test.jpg',
        mimetype: 'image/jpeg',
        size: 4,
        fieldname: 'avatar',
        encoding: '7bit',
      };
      const userId = 'user-123';
      const bucket = 'avatars';

      it('should successfully upload a file', async () => {
        const mockUrl = 'https://example.com/avatars/user-123/random-uuid.jpg?query=123';
        jest.spyOn(storageService, 'upload').mockResolvedValue(mockUrl);

        const result = await service.uploadFile(mockFile, bucket, userId);

        expect(storageService.upload).toHaveBeenCalledWith(mockFile.buffer, bucket, expect.stringContaining(`user-123/`), mockFile.mimetype);
        expect(result.url).toBe(mockUrl);
        expect(result.filename).toMatch(/^[a-f0-9-]+\.jpg$/);
      });

      it('should throw InternalServerErrorException on failure', async () => {
        jest.spyOn(storageService, 'upload').mockRejectedValue(new Error('secret error message'));
        await expect(service.uploadFile(mockFile, bucket, userId)).rejects.toThrow(InternalServerErrorException);
      });

      it('should not leak internal error message to client', async () => {
        jest.spyOn(storageService, 'upload').mockRejectedValue(new Error('secret error message'));
        expect.assertions(1);
        try { 
          await service.uploadFile(mockFile, bucket, userId); 
        } catch (e: any) { 
          expect(e.message).toBe('Could not upload file'); 
        }
      });
    });
  });

  describe('FileValidationPipe', () => {
    let pipe: FileValidationPipe;

    const validPngBuffer = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
    const validJpegBuffer = Buffer.from([0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46]);
    const spoofedPngBuffer = Buffer.from('just a text file acting like png');

    beforeEach(() => {
      pipe = new FileValidationPipe({
        maxSizeBytes: 5 * 1024 * 1024,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp']
      });
    });

    it('should validate a correct file', () => {
      const mockFile = { buffer: validPngBuffer, originalname: 'a.png', mimetype: 'image/png', size: 1000, fieldname: 'f', encoding: 'e' };
      expect(pipe.transform(mockFile)).toEqual(mockFile);
    });

    it('should throw BadRequestException if file is missing', () => {
      expect(() => pipe.transform(undefined)).toThrow(BadRequestException);
    });

    it('should throw BadRequestException for invalid mimetype', () => {
      const mockFile = { buffer: Buffer.from('dummy'), originalname: 'a.pdf', mimetype: 'application/pdf', size: 1000, fieldname: 'f', encoding: 'e' };
      expect(() => pipe.transform(mockFile)).toThrow(BadRequestException);
    });

    it('should throw BadRequestException if file exceeds size limit', () => {
      const mockFile = { buffer: validPngBuffer, originalname: 'a.png', mimetype: 'image/png', size: 6 * 1024 * 1024, fieldname: 'f', encoding: 'e' };
      expect(() => pipe.transform(mockFile)).toThrow(BadRequestException);
    });
    
    it('should throw BadRequestException for spoofed MIME type', () => {
      const mockFile = { buffer: spoofedPngBuffer, originalname: 'a.png', mimetype: 'image/png', size: 1000, fieldname: 'f', encoding: 'e' };
      expect(() => pipe.transform(mockFile)).toThrow(BadRequestException);
    });
  });

  describe('LocalStorageService', () => {
    let service: LocalStorageService;

    beforeEach(() => {
      (fs.promises.access as jest.Mock).mockResolvedValue(undefined);
      service = new LocalStorageService();
    });

    it('should generate a unique filename with safe extension', async () => {
      (fs.promises.writeFile as jest.Mock).mockResolvedValue(undefined);
      (fs.promises.mkdir as jest.Mock).mockResolvedValue(undefined);
      
      const bucket = 'avatars';
      const destinationKey = 'user-123/random-uuid.jpg';
      const url = await service.upload(Buffer.from('test'), bucket, destinationKey, 'image/jpeg');
      
      expect(url).toBe(`/uploads/${bucket}/${destinationKey}`);
      expect(fs.promises.writeFile).toHaveBeenCalled();
    });

    it('should throw an error if path traversal is attempted', async () => {
      await expect(service.upload(Buffer.from('test'), 'avatars', '../../etc/passwd', 'image/jpeg'))
        .rejects.toThrow('path traversal detected');
    });
  });
});
