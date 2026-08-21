import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateAlertDto {
  @IsString()
  @IsNotEmpty()
  query: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
