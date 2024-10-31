import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateGoalDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  initialDate?: string;

  @IsOptional()
  @IsString()
  finalDate?: string;

  @IsOptional()
  @IsNumber()
  quantity?: number;
}
