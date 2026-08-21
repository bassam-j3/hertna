import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('ratings')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createRatingDto: CreateRatingDto, @Request() req) {
    return this.ratingsService.create(createRatingDto, req.user.userId);
  }

  @Get()
  findAll() {
    return this.ratingsService.findAll();
  }
}
