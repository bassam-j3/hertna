import { IsString, IsNotEmpty, IsDateString, IsOptional, IsEnum } from 'class-validator';
import { SwapActionType } from '@prisma/client';

export class CreateSwapDto {
  @IsString()
  @IsOptional()
  postId?: string;



  @IsString()
  @IsNotEmpty()
  title: string;

  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @IsDateString()
  @IsNotEmpty()
  dueDate: string;

  @IsEnum(SwapActionType)
  @IsOptional()
  actionType?: SwapActionType;
}
