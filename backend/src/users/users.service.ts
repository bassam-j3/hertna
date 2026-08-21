import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async updateProfile(userId: string, data: any) {
    const { name, city, neighborhood, avatar, bio, phone } = data;
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(city && { city }),
        ...(neighborhood && { neighborhood }),
        ...(avatar && { avatar }),
        ...(bio && { bio }),
        ...(phone && { phone }),
      },
    });
  }
}
