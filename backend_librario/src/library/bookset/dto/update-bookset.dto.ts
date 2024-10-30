import { IsArray, IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateBooksetDto {
  @IsOptional()
  @IsString()
  readonly name: string;

  @IsArray()
  @IsOptional()
  @IsInt({ each: true })
  book: number[];
}
