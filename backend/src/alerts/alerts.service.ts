import { Injectable } from '@nestjs/common';
import { CreateAlertDto } from './dto/create-alert.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AlertsService {
  constructor(private prisma: PrismaService) {}

  create(createAlertDto: CreateAlertDto, userId: string) {
    return this.prisma.itemAlert.create({
      data: {
        ...createAlertDto,
        userId,
      },
    });
  }

  findAll(userId: string) {
    return this.prisma.itemAlert.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  remove(id: string, userId: string) {
    return this.prisma.itemAlert.deleteMany({
      where: { id, userId },
    });
  }
}
