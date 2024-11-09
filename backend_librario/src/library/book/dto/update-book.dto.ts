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
  publicationDate?: Date;

  @IsOptional()
  acquisitionDate?: Date;

  @IsOptional()
  @IsNumber()
  format?: number;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsBoolean()
  asExpense?: boolean;

  @IsOptional()
  @IsString()
  coverUrl?: string;

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
