import { Controller, Get, Patch, Param, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

/**
 * متحكم الإدارة (Admin Controller)
 * 
 * هذا المتحكم محمي بالكامل ويُسمح فقط للجنة الحي (Committee) بالوصول لمساراته.
 * يوفر واجهات برمجية (APIs) لإدارة المستخدمين والتذاكر الفنية.
 */
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // التحقق من الصلاحيات (Role-Based Access Control): يتم رفض أي طلب لا يحمل رتبة "لجنة" أو "مشرف"
  private checkCommittee(req: any) {
    if (req.user.userType !== 'committee' && req.user.userType !== 'admin') {
      throw new ForbiddenException('Access denied. Committee members only.');
    }
  }

  @Get('users')
  @UseGuards(JwtAuthGuard)
  getAllUsers(@Request() req) {
    this.checkCommittee(req);
    return this.adminService.getAllUsers();
  }

  @Patch('users/:id/warn')
  @UseGuards(JwtAuthGuard)
  warnUser(@Request() req, @Param('id') id: string) {
    this.checkCommittee(req);
    return this.adminService.warnUser(id);
  }

  @Patch('users/:id/block')
  @UseGuards(JwtAuthGuard)
  blockUser(@Request() req, @Param('id') id: string) {
    this.checkCommittee(req);
    return this.adminService.blockUser(id);
  }

  @Patch('users/:id/activate')
  @UseGuards(JwtAuthGuard)
  activateUser(@Request() req, @Param('id') id: string) {
    this.checkCommittee(req);
    return this.adminService.activateUser(id);
  }

  @Patch('users/:id/promote')
  @UseGuards(JwtAuthGuard)
  promoteUser(@Request() req, @Param('id') id: string) {
    this.checkCommittee(req);
    return this.adminService.promoteUser(id);
  }

  @Get('tickets')
  @UseGuards(JwtAuthGuard)
  getAllTickets(@Request() req) {
    this.checkCommittee(req);
    return this.adminService.getAllTickets();
  }

  @Patch('tickets/:id/resolve')
  @UseGuards(JwtAuthGuard)
  resolveTicket(@Request() req, @Param('id') id: string) {
    this.checkCommittee(req);
    return this.adminService.resolveTicket(id);
  }
}
