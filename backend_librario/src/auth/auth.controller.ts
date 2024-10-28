import { Body, Controller, Post } from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

import { AuthService } from './auth.service';

import { LoginAuth } from './interfaces/auth.interface';
import { MessageResponse } from 'src/common/interfaces/response.interface';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    @Post('/create')
    async createUser(@Body() newUser: CreateUserDto): Promise<MessageResponse> {
        return await this.authService.create(newUser);
    }

    @Post('/login')
    async login(@Body() user: LoginDto): Promise<LoginAuth> {
        return await this.authService.login(user);
    }
}
