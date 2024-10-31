// create-goal.dto.ts
import { IsString, IsDateString, IsNumber } from 'class-validator';

export class CreateGoalDto {
  @IsString()
  title: string;

  @IsDateString()
  initialDate: string;

  @IsDateString()
  finalDate: string;

  @IsNumber()
  quantity: number;
}
