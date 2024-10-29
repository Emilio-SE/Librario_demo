import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { compare, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

import { User } from 'src/account/user/user.entity';

import { JwtPayload, LoginAuth } from './interfaces/auth.interface';
import { MessageResponse } from 'src/common/interfaces/response.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtSvc: JwtService,
  ) {}

  public async create(user: CreateUserDto): Promise<MessageResponse> {
    const { password, email } = user;

    const findUser = await this.userRepository.findOne({ where: { email } });

    if (findUser)
      throw new HttpException(
        'User with this email already exists',
        HttpStatus.BAD_REQUEST,
      );

    const hashedPassword: string = await hash(password, 10);

    user.password = hashedPassword;
    const newUser: User = this.userRepository.create(user);
    this.userRepository.save(newUser);

    return {
      message: 'User created successfully',
    };
  }

  public async login(user: LoginDto): Promise<LoginAuth> {
    const { email, password } = user;
    const findUser = await this.userRepository.findOne({ where: { email } });
    if (!findUser)
      throw new HttpException(
        'Invalid credentials provided',
        HttpStatus.FORBIDDEN,
      );

    const isPasswordMatching: boolean = await compare(
      password,
      findUser.password,
    );

    if (!isPasswordMatching)
      throw new HttpException(
        'Invalid credentials provided',
        HttpStatus.FORBIDDEN,
      );

    const payload: JwtPayload = {
      email: findUser.email,
      id: findUser.id,
    };
    const token: string = this.jwtSvc.sign(payload);

    const data: LoginAuth = {
      token,
    };

    return data;
  }
}
