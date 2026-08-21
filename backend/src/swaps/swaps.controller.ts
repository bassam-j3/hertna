import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { SwapsService } from './swaps.service';
import { CreateSwapDto } from './dto/create-swap.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('swaps')
@UseGuards(JwtAuthGuard)
/**
 * متحكم المبادلات (Swaps Controller)
 * 
 * يعالج دورة حياة المبادلات (Handshake Protocol) بين المستخدمين
 * (طلب إعارة -> موافقة -> قيد الاستخدام -> تم الإرجاع).
 */
export class SwapsController {
  constructor(private readonly swapsService: SwapsService) {}

  @Post()
  create(@Body() createSwapDto: CreateSwapDto, @Request() req) {
    return this.swapsService.create(createSwapDto, req.user.userId);
  }

  @Get('my-swaps')
  findMySwaps(@Request() req) {
    return this.swapsService.findMySwaps(req.user.userId);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Request() req,
  ) {
    return this.swapsService.updateStatus(id, status, req.user.userId);
  }
}
