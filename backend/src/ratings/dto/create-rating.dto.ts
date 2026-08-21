import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateRatingDto {
  @IsNumber()
  @IsNotEmpty()
  rating: number;

  @IsString()
  @IsNotEmpty()
  comment: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  swapItemId?: string;

  @IsString()
  @IsNotEmpty()
  targetUserId: string;
}
