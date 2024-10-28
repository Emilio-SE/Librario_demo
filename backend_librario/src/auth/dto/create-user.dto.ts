import { IsEmail, MinLength } from "class-validator";

export class CreateUserDto {
    @MinLength(3)
    name: string;

    @MinLength(3)
    password: string;

    @IsEmail()
    email: string;
}