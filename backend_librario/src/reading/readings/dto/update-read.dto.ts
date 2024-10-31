import { IsOptional, IsString, IsNumber, IsDateString } from 'class-validator';

export class UpdateReadingDto {
  @IsOptional()
  @IsString()
  rate?: string;

  @IsOptional()
  @IsString()
  review?: string;

  @IsOptional()
  @IsNumber()
  currentPage?: number;

  @IsOptional()
  @IsDateString()
  startReadingDate?: string;

  @IsOptional()
  @IsDateString()
  endReadingDate?: string;
}
