import { IsEmail } from "class-validator";

export class GetUserDataDto {
    @IsEmail()
    email: string;
}