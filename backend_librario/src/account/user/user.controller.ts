import { Body, Controller, Delete, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Request } from 'express';

import { DeleteUserDataDto } from './dto/delete-user.dto';

import { UserService } from './user.service';

import { MessageResponse } from 'src/common/interfaces/response.interface';
import { UserDataAccount } from './interfaces/user.interface';

@Controller('account/user')
export class UserController {
  constructor(private userSvc: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  async profile(@Req() req: Request): Promise<UserDataAccount> {
    return await this.userSvc.findUser(req.user['email']);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/delete')
  async deleteAccount(
    @Req() req: Request,
    @Body() password: DeleteUserDataDto,
  ): Promise<MessageResponse> {
    return await this.userSvc.deleteAccount(req.user['email'], password);
  }
}
