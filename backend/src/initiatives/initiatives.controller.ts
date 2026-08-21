import { Controller, Get, Post, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { InitiativesService } from './initiatives.service';
import { CreateInitiativeDto } from './dto/create-initiative.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('initiatives')
export class InitiativesController {
  constructor(private readonly initiativesService: InitiativesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createInitiativeDto: CreateInitiativeDto, @Request() req) {
    return this.initiativesService.create(createInitiativeDto, req.user.userId);
  }

  @Get()
  findAll(@Query('category') category?: string) {
    return this.initiativesService.findAll(category);
  }

  @Post(':id/join')
  @UseGuards(JwtAuthGuard)
  toggleJoin(@Param('id') id: string, @Request() req) {
    return this.initiativesService.toggleJoin(id, req.user.userId);
  }
}
