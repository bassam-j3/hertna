import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, PostType, SwapStatus } from '@prisma/client';

export interface FindPostsQuery {
  type?: PostType;
  category?: string;
  search?: string;
  lat?: number;
  lng?: number;
}

const POST_SELECT = {
  id: true,
  title: true,
  description: true,
  category: true,
  type: true,
  urgent: true,
  distanceKm: true,
  location: true,
  image: true,
  isAnonymous: true,
  tags: true,
  createdAt: true,
  updatedAt: true,
  userId: true,
  user: {
    select: {
      id: true,
      name: true,
      avatar: true,
      neighborhood: true,
      trustPoints: true,
    }
  },
  swapItems: {
    where: { status: { notIn: [SwapStatus.COMPLETED, SwapStatus.CANCELLED] } },
    select: {
      id: true,
      status: true,
      borrowerId: true,
      lenderId: true,
      createdAt: true,
    }
  },
};

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
    // Demand-driven paradigm: all posts are strictly REQUEST.
    return this.prisma.post.create({
      data: {
        ...createPostDto,
        type: PostType.REQUEST,
        description: createPostDto.description || '',
        location: createPostDto.location || 'دمشق - حي الروضة',
        userId,
      },
    });
  }

  // جلب الطلبات من الداتابيز. إذا تم تمرير إحداثيات، يتم حساب المسافة (Geospatial logic)
  async findAll(query: FindPostsQuery) {
    const where: Prisma.PostWhereInput = {
      swapItems: {
        none: {
          status: { not: SwapStatus.CANCELLED }
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
      select: POST_SELECT,
    });
  }

  async findOne(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      select: POST_SELECT,
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
