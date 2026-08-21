import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
/**
 * خدمة الطلبات (Posts Service)
 * 
 * تتعامل مباشرة مع قاعدة البيانات Prisma وتنفذ المنطق البرمجي (Business Logic)
 * لحفظ، استرجاع، وحذف الطلبات.
 */
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async create(createPostDto: CreatePostDto, userId: string) {
    return this.prisma.post.create({
      data: {
        ...createPostDto,
        description: createPostDto.description || '',
        location: createPostDto.location || 'دمشق - حي الروضة',
        userId,
      },
    });
  }

  // جلب الطلبات من الداتابيز. إذا تم تمرير إحداثيات، يتم حساب المسافة (Geospatial logic)
  async findAll(query: any) {
    const where: any = {
      swapItems: {
        none: {
          status: { not: 'cancelled' }
        }
      }
    };
    if (query.type) {
      where.type = query.type;
    }
    if (query.category) {
      where.category = query.category;
    }
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    
    return this.prisma.post.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
            neighborhood: true,
            trustPoints: true,
          }
        }
      }
    });
  }

  async findOne(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
            neighborhood: true,
            trustPoints: true,
            phone: true,
          }
        },
        swapItems: {
          where: { status: { not: 'completed' } },
        }
      }
    });
    
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    
    return post;
  }

  async remove(id: string, userId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });
    
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    
    if (post.userId !== userId) {
      throw new ForbiddenException('You can only delete your own posts');
    }
    
    return this.prisma.post.delete({
      where: { id },
    });
  }
}
