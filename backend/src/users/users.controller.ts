import { Controller, Patch, Body, UseGuards, Request, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UsersService, UpdateProfileDto } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileValidationPipe } from '../upload/pipes/file-validation.pipe';
import type { StrictUploadedFile } from '../upload/interfaces/uploaded-file.interface';
import { AVATAR_UPLOAD_OPTIONS } from '../upload/constants/upload.constants';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  async updateProfile(@Request() req, @Body() data: UpdateProfileDto) {
    const userId = req.user.userId;
    return this.usersService.updateProfile(userId, data);
  }

  @Post('me/avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  async updateAvatar(
    @Request() req,
    @UploadedFile(new FileValidationPipe(AVATAR_UPLOAD_OPTIONS)) file: StrictUploadedFile,
  ) {
    const userId = req.user.userId;
    const { avatarUrl, user } = await this.usersService.uploadAndUpdateAvatar(userId, file);
    
    return {
      message: 'Avatar updated successfully',
      avatarUrl,
      user,
    };
  }
}
