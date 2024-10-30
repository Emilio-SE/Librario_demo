import { IsArray, IsInt, IsString } from 'class-validator';

export class CreateBooksetDto {
  @IsString()
  name: string;

  @IsArray()
  @IsInt({ each: true })
  book: number[];
}
