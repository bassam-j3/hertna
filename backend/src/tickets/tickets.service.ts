import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TicketsService {
  constructor(private prisma: PrismaService) {}

  async createTicket(userId: string, data: { type: string; message: string }) {
    return this.prisma.supportTicket.create({
      data: {
        userId,
        type: data.type,
        message: data.message,
      },
    });
  }
}
