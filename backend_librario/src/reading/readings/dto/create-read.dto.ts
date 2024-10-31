import { IsInt, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';

export class CreateReadingDto {
  @IsNotEmpty()
  book: string;

  @IsInt()
  currentPage: number;

  @IsOptional()
  @IsDateString()
  startReadingDate: Date;
}
