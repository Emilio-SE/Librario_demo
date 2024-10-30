import { IsString, IsNotEmpty, IsArray } from 'class-validator';

export class CreateShelfDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  book: string[];
}
