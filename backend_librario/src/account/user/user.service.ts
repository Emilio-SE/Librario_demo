import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { compare } from 'bcrypt';

import { DeleteUserDataDto } from './dto/delete-user.dto';

import { User } from './user.entity';

import { UserDataAccount } from './interfaces/user.interface';
import { MessageResponse } from 'src/common/interfaces/response.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  public async findUser(email: string): Promise<UserDataAccount> {
    const userData: User = await this.userRepository.findOne({
      where: { email: email },
    });

    return {
      id: userData.id,
      name: userData.name,
      email: userData.email,
    } as UserDataAccount;
  }

  public async deleteAccount(
    email: string,
    password: DeleteUserDataDto,
  ): Promise<MessageResponse> {

    const response: MessageResponse = {
      message: 'Unknown error',
    };

    if (!password.password) {
      response.message = 'Password is required';
      return response;
    }

    const userData: User = await this.userRepository.findOne({
      where: { email: email },
    });

    if (!userData) {
      response.message = 'User not found';
      return response;
    }

    const isPasswordMatching: boolean = await compare(
      password.password,
      userData.password,
    );

    if (!isPasswordMatching) {
      response.message = 'Incorrect password';
      return response;
    }

    await this.userRepository.delete(userData.id);

    response.message = 'Account deleted successfully';
    return response;
  }
}
