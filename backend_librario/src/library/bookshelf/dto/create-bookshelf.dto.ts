import { IsString, IsNotEmpty } from 'class-validator';

export class CreateBookshelfDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}