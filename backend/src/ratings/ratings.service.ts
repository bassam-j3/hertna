import { Injectable } from '@nestjs/common';
import { CreateRatingDto } from './dto/create-rating.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RatingsService {
  constructor(private prisma: PrismaService) {}

  async create(createRatingDto: CreateRatingDto, authorId: string) {
    const { rating, comment, category, swapItemId, targetUserId } = createRatingDto;

    // Create the rating
    const newRating = await this.prisma.rating.create({
      data: {
        rating,
        comment,
        category,
        swapItemId,
        authorId,
        targetUserId,
      },
    });

    // Recalculate Trust Points: +10 for 5, +5 for 4, 0 for 3, -5 for 2, -10 for 1
    const pointAdjustment = (rating - 3) * 5;

    await this.prisma.user.update({
      where: { id: targetUserId },
      data: {
        trustPoints: { increment: pointAdjustment },
      },
    });

    return newRating;
  }

  findAll() {
    return this.prisma.rating.findMany({
      include: { author: true },
    });
  }
}
