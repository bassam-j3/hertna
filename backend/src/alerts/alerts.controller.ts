import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('alerts')
@UseGuards(JwtAuthGuard)
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Post()
  create(@Body() createAlertDto: CreateAlertDto, @Request() req) {
    return this.alertsService.create(createAlertDto, req.user.userId);
  }

  @Get()
  findAll(@Request() req) {
    return this.alertsService.findAll(req.user.userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.alertsService.remove(id, req.user.userId);
  }
}
