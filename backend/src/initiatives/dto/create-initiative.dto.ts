import { IsString, IsNotEmpty, IsNumber, IsOptional, IsEnum, IsArray } from 'class-validator';
import { InitiativeCategory, InitiativeStatus } from '@prisma/client';

export class CreateInitiativeDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(InitiativeCategory)
  @IsOptional()
  category?: InitiativeCategory;

  @IsString()
  @IsOptional()
  categoryLabel?: string;

  @IsString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsNotEmpty()
  time: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsNumber()
  @IsOptional()
  maxParticipants?: number;

  @IsString()
  @IsOptional()
  image?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}
