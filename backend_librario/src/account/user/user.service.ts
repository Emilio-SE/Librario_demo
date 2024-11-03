import { HttpException, Injectable } from '@nestjs/common';
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
    if (!password.password) {
      throw new HttpException('La contraseña es requerida', 400);
    }

    const userData: User = await this.userRepository.findOne({
      where: { email: email },
    });

    if (!userData) {
      throw new HttpException('Usuario no encontrado,', 400);
    }

    const isPasswordMatching: boolean = await compare(
      password.password,
      userData.password,
    );

    if (!isPasswordMatching) {
      throw new HttpException('Contraseña incorrecta', 400);
    }

    await this.userRepository.delete(userData.id);

    return {
      message: 'Usuario eliminado',
      statusCode: 200,
    };
  }
}
