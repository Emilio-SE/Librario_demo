import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsDateString,
  IsArray,
} from 'class-validator';
import { Format } from 'src/library/format/format.entity';
import { DeepPartial } from 'typeorm';

export class CreateBookDto {
  @IsString()
  title: string;

  @IsString()
  author: string;

  @IsString()
  isbn: string;

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
  @IsNumber()
  format?: DeepPartial<Format>;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsBoolean()
  asExpense?: boolean;

  @IsOptional()
  @IsArray()
  genre?: number[];

  @IsOptional()
  @IsArray()
  tag?: number[];

  @IsOptional()
  @IsArray()
  bookset?: number[];
}
