import { MinLength } from "class-validator";

export class DeleteUserDataDto {
    @MinLength(3)
    password: string;
}