import { Controller, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  async updateProfile(@Request() req, @Body() data: { name?: string; city?: string; neighborhood?: string; avatar?: string; bio?: string; phone?: string; job?: string }) {
    const userId = req.user.userId;
    return this.usersService.updateProfile(userId, data);
  }
}
