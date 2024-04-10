import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  CreateUserDto,
  LoginDto,
} from 'apps/api/src/modules/user/dto/user.dto';
import { UserRepositoryInterface, UserEntity } from '@app/shared';
import { AuthServiceInterface } from './interface/auth.service.interface';

@Injectable()
export class AuthService implements AuthServiceInterface {
  constructor(
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
    private readonly jwtService: JwtService,
  ) {}

  async getUsers() {
    return this.userRepository.findAll();
  }

  async findByEmail(email: string): Promise<UserEntity> {
    return this.userRepository.findByCondition({
      where: { email },
      select: ['id', 'email', 'password', 'firstName', 'lastName'],
    });
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async validUser(email: string, password: string): Promise<boolean> {
    const user = await this.findByEmail(email);
    if (!user) {
      return false;
    }
    const isValidPassword = await this.comparePassword(password, user.password);
    if (!isValidPassword) {
      return false;
    }
    return true;
  }

  async generateJwt(payload: any): Promise<string> {
    return this.jwtService.signAsync(payload);
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

  async login(loginPayload: LoginDto): Promise<{ token: string }> {
    const { email, password } = loginPayload;
    const isValidUser = await this.validUser(email, password);

    if (!isValidUser) {
      throw new UnauthorizedException();
    }

    const jwt = await this.generateJwt({ email });

    return { token: jwt };
  }

  async verifyJwt(jwt: string): Promise<{ user: UserEntity }> {
    if (!jwt) {
      throw new UnauthorizedException();
    }
    try {
      const decoded = await this.jwtService.verifyAsync(jwt);
      const user = await this.findByEmail(decoded.email);
      delete user.password;
      return { user };
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
