import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateSwapDto } from './dto/create-swap.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
/**
 * خدمة المبادلات (Swaps Service)
 * 
 * تدير المنطق البرمجي لحفظ المبادلات في الداتابيز والتأكد من الصلاحيات.
 */
export class SwapsService {
  constructor(private prisma: PrismaService) {}

  async create(createSwapDto: CreateSwapDto, currentUserId: string) {
    const post = await this.prisma.post.findUnique({ where: { id: createSwapDto.postId } });
    if (!post) throw new NotFoundException('Post not found');

    return this.prisma.swapItem.create({
      data: {
        title: createSwapDto.title,
        startDate: new Date(createSwapDto.startDate),
        dueDate: new Date(createSwapDto.dueDate),
        status: 'pending',
        postId: post.id,
        borrowerId: post.userId, // The person who requested the item
        lenderId: currentUserId, // The person who is offering to help
      },
    });
  }

  async findMySwaps(userId: string) {
    const asBorrower = await this.prisma.swapItem.findMany({
      where: { borrowerId: userId },
      include: {
        lender: { select: { id: true, name: true, avatar: true, phone: true } },
        post: { select: { image: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    const asLender = await this.prisma.swapItem.findMany({
      where: { lenderId: userId },
      include: {
        borrower: { select: { id: true, name: true, avatar: true, phone: true } },
        post: { select: { image: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return {
      asBorrower,
      asLender,
    };
  }

  // تحديث حالة الطلب والتحقق من أن المستخدم يملك الصلاحية (إما المالك أو المستعير)
  async updateStatus(id: string, status: string, userId: string) {
    const swap = await this.prisma.swapItem.findUnique({
      where: { id },
    });

    if (!swap) {
      throw new NotFoundException('Swap not found');
    }

    if (swap.borrowerId !== userId && swap.lenderId !== userId) {
      throw new UnauthorizedException('You are not authorized to update this swap');
    }

    return this.prisma.swapItem.update({
      where: { id },
      data: { status },
    });
  }
}
