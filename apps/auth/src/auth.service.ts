import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './models/user.entity';
import { CreateUserDto } from 'apps/api/src/modules/user/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async getUsers() {
    return this.userRepository.find();
  }

  async findByEmail(email: string): Promise<UserEntity> {
    return this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'firstName', 'lastName'],
    });
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  async registerUser(user: Readonly<CreateUserDto>): Promise<UserEntity> {
    const { email, firstName, lastName, password } = user;
    const existedUser = await this.findByEmail(email);

    if (existedUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await this.hashPassword(password);
    const createdUser = await this.userRepository.save({
      email,
      firstName,
      lastName,
      password: hashedPassword,
    });
    delete createdUser.password;

    return createdUser;
  }
}
