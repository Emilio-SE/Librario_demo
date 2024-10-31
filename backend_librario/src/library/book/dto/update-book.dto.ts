import { IsOptional, IsString, IsNumber, IsBoolean, IsDateString } from 'class-validator';

export class UpdateBookDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  author?: string;

  @IsOptional()
  @IsString()
  isbn?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  publisher?: string;

  @IsOptional()
  @IsString()
  edition?: string;

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsNumber()
  pages?: number;

  @IsOptional()
  @IsDateString()
  publicationDate?: Date;

  @IsOptional()
  @IsDateString()
  acquisitionDate?: Date;

  @IsOptional()
  @IsString()
  formatId?: number;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsBoolean()
  asExpense?: boolean;

  @IsOptional()
  @IsNumber({}, { each: true })
  genre?: number[];

  @IsOptional()
  @IsNumber({}, { each: true })
  tag?: number[];

  @IsOptional()
  @IsNumber({}, { each: true })
  bookset?: number[];
}
