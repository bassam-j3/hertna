import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsNumber, IsArray, IsIn } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['OFFER', 'REQUEST'])
  type: 'OFFER' | 'REQUEST';

  @IsBoolean()
  @IsOptional()
  urgent?: boolean;

  @IsNumber()
  @IsOptional()
  distanceKm?: number;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsBoolean()
  @IsOptional()
  isAnonymous?: boolean;

  @IsArray()
  @IsOptional()
  tags?: string[];
}
