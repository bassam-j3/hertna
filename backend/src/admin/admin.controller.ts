import { Controller, Get, Patch, Param, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

export interface AuthenticatedUser {
  id: string;
  userId: string;
  email: string;
  userType: string;
}

export interface AuthenticatedRequest {
  user: AuthenticatedUser;
}

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
  private checkCommittee(req: AuthenticatedRequest) {
    if (req.user.userType !== 'committee' && req.user.userType !== 'admin') {
      throw new ForbiddenException('Access denied. Committee members only.');
    }
  }

  @Get('users')
  @UseGuards(JwtAuthGuard)
  getAllUsers(@Request() req: AuthenticatedRequest) {
    this.checkCommittee(req);
    return this.adminService.getAllUsers();
  }

  @Patch('users/:id/warn')
  @UseGuards(JwtAuthGuard)
  warnUser(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    this.checkCommittee(req);
    return this.adminService.warnUser(id);
  }

  @Patch('users/:id/block')
  @UseGuards(JwtAuthGuard)
  blockUser(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    this.checkCommittee(req);
    return this.adminService.blockUser(id);
  }

  @Patch('users/:id/activate')
  @UseGuards(JwtAuthGuard)
  activateUser(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    this.checkCommittee(req);
    return this.adminService.activateUser(id);
  }

  @Patch('users/:id/promote')
  @UseGuards(JwtAuthGuard)
  promoteUser(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    this.checkCommittee(req);
    return this.adminService.promoteUser(id);
  }

  @Get('tickets')
  @UseGuards(JwtAuthGuard)
  getAllTickets(@Request() req: AuthenticatedRequest) {
    this.checkCommittee(req);
    return this.adminService.getAllTickets();
  }

  @Patch('tickets/:id/resolve')
  @UseGuards(JwtAuthGuard)
  resolveTicket(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    this.checkCommittee(req);
    return this.adminService.resolveTicket(id);
  }

  @Get('initiatives')
  @UseGuards(JwtAuthGuard)
  getAllInitiatives(@Request() req: AuthenticatedRequest) {
    this.checkCommittee(req);
    return this.adminService.getAllInitiatives();
  }

  @Patch('initiatives/:id/approve')
  @UseGuards(JwtAuthGuard)
  approveInitiative(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    this.checkCommittee(req);
    return this.adminService.approveInitiative(id);
  }

  @Patch('initiatives/:id/reject')
  @UseGuards(JwtAuthGuard)
  rejectInitiative(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    this.checkCommittee(req);
    return this.adminService.rejectInitiative(id);
  }
}
