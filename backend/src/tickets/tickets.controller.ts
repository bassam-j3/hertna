import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  createTicket(@Request() req, @Body() data: { type: string; message: string }) {
    return this.ticketsService.createTicket(req.user.userId, data);
  }
}
