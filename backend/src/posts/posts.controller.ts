import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('posts')
/**
 * متحكم الطلبات (Posts Controller)
 * 
 * يعالج الطلبات القادمة لإنشاء، جلب، أو حذف منشورات (إعارة/تبرع/عاجل).
 * يستخدم الـ JwtAuthGuard للتأكد من أن المستخدم مسجل دخول.
 */
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createPostDto: CreatePostDto, @Request() req) {
    return this.postsService.create(createPostDto, req.user.userId);
  }

  @Get()
  findAll(@Query() query) {
    return this.postsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.postsService.remove(id, req.user.userId);
  }
}
