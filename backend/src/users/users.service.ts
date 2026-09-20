import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UploadService } from '../upload/upload.service';
import type { StrictUploadedFile } from '../upload/interfaces/uploaded-file.interface';

export class UpdateProfileDto {
  name?: string;
  city?: string;
  neighborhood?: string;
  avatar?: string;
  bio?: string;
  phone?: string;
  job?: string;
}

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadService: UploadService
  ) {}

  async updateProfile(userId: string, data: UpdateProfileDto) {
    const { name, city, neighborhood, avatar, bio, phone, job } = data;
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(city && { city }),
        ...(neighborhood && { neighborhood }),
        ...(avatar && { avatar }),
        ...(bio && { bio }),
        ...(phone && { phone }),
        ...(job && { job }),
      },
    });
  }

  async updateAvatar(userId: string, avatarUrl: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { avatar: avatarUrl },
    });
  }

  async uploadAndUpdateAvatar(userId: string, file: StrictUploadedFile) {
    const result = await this.uploadService.uploadFile(file, 'avatars', userId);
    const user = await this.updateAvatar(userId, result.url);
    return { avatarUrl: result.url, user };
  }
}
