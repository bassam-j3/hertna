import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, PostType } from '@prisma/client';

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
      select: POST_SELECT,
    });
  }

  // جلب الطلبات من الداتابيز. إذا تم تمرير إحداثيات، يتم حساب المسافة (Geospatial logic)
  async findAll(query: FindPostsQuery) {
    const where: Prisma.PostWhereInput = {};
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

    const posts = await this.prisma.post.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: { ...POST_SELECT, lat: true, lng: true },
    });

    // Filter by proximity if lat/lng/radius provided
    if (query.lat != null && query.lng != null) {
      const radiusKm = 50; // Default 50km radius
      return posts.filter((post) => {
        if (post.lat == null || post.lng == null) return true;
        const distance = this.haversineDistance(query.lat!, query.lng!, post.lat, post.lng);
        return distance <= radiusKm;
      }).map(({ lat, lng, ...rest }) => rest);
    }

    return posts.map(({ lat, lng, ...rest }) => rest);
  }

  private haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
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
