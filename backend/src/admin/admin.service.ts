import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers() {
    return this.prisma.user.findMany({
      select: { id: true, name: true, phone: true, status: true, warnings: true, userType: true }
    });
  }

  async warnUser(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: { warnings: { increment: 1 } },
    });
  }

  async blockUser(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: { status: 'blocked' },
    });
  }

  async activateUser(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: { status: 'active' },
    });
  }

  async promoteUser(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: { userType: 'committee' },
    });
  }

  async getAllTickets() {
    return this.prisma.supportTicket.findMany({
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: 'desc' }
    });
  }

  async resolveTicket(id: string) {
    return this.prisma.supportTicket.update({
      where: { id },
      data: { status: 'resolved' },
    });
  }

  async getAllInitiatives() {
    return this.prisma.communityInitiative.findMany({
      include: {
        organizer: { select: { id: true, name: true, phone: true, avatar: true } },
        _count: { select: { participants: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async approveInitiative(id: string) {
    return this.prisma.communityInitiative.update({
      where: { id },
      data: { status: 'ACTIVE' },
    });
  }

  async rejectInitiative(id: string) {
    return this.prisma.communityInitiative.update({
      where: { id },
      data: { status: 'COMPLETED' },
    });
  }
}
