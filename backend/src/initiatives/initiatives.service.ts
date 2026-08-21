import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInitiativeDto } from './dto/create-initiative.dto';
import { PrismaService } from '../prisma/prisma.service';
import { InitiativeCategory } from '@prisma/client';

@Injectable()
export class InitiativesService {
  constructor(private prisma: PrismaService) {}

  async create(createInitiativeDto: CreateInitiativeDto, userId: string) {
    return this.prisma.communityInitiative.create({
      data: {
        ...createInitiativeDto,
        organizerId: userId,
        status: 'UPCOMING',
      },
    });
  }

  async findAll(category?: string) {
    const whereClause = category && category !== 'all' ? { category: category as InitiativeCategory } : {};
    return this.prisma.communityInitiative.findMany({
      where: whereClause,
      include: {
        organizer: { select: { id: true, name: true, avatar: true } },
        participants: {
          include: { user: { select: { id: true, name: true, avatar: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async toggleJoin(initiativeId: string, userId: string) {
    const init = await this.prisma.communityInitiative.findUnique({
      where: { id: initiativeId },
    });
    if (!init) throw new NotFoundException('Initiative not found');

    const existing = await this.prisma.initiativeParticipant.findUnique({
      where: {
        userId_initiativeId: {
          userId,
          initiativeId,
        },
      },
    });

    if (existing) {
      // Leave
      await this.prisma.initiativeParticipant.delete({
        where: { id: existing.id },
      });
      return { joined: false };
    } else {
      // Join
      await this.prisma.initiativeParticipant.create({
        data: {
          userId,
          initiativeId,
        },
      });
      return { joined: true };
    }
  }
}
