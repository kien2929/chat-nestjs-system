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
import {
  UserJwt,
  UserEntity,
  UserRepositoryInterface,
  FriendRequestRepositoryInterface,
} from '@app/shared';
import { AuthServiceInterface } from './interface/auth.service.interface';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class AuthService implements AuthServiceInterface {
  constructor(
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
    @Inject('FriendRequestRepositoryInterface')
    private readonly friendRequestRepository: FriendRequestRepositoryInterface,
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

  async validUser(email: string, password: string): Promise<UserEntity> {
    const user = await this.findByEmail(email);
    if (!user) {
      return null;
    }
    const isValidPassword = await this.comparePassword(password, user.password);

    if (!isValidPassword) return null;

    return user;
  }

  async generateJwt(payload: any): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  async registerUser(user: Readonly<CreateUserDto>): Promise<UserEntity> {
    const { email, firstName, lastName, password } = user;
    const existedUser = await this.findByEmail(email);

    if (existedUser) {
      throw new RpcException(new ConflictException('Email already exists'));
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
    const user = await this.validUser(email, password);

    if (!user) {
      throw new RpcException(new UnauthorizedException());
    }
    delete user.password;
    const jwt = await this.generateJwt({ user });

    return { token: jwt };
  }

  async verifyJwt(jwt: string): Promise<{ user: UserEntity; exp: number }> {
    if (!jwt) {
      throw new RpcException(new UnauthorizedException());
    }
    try {
      const { user, exp } = await this.jwtService.verifyAsync(jwt);
      return { user, exp };
    } catch (error) {
      throw new RpcException(new UnauthorizedException());
    }
  }

  async getUserFromHeader(jwt: string): Promise<UserJwt> {
    if (!jwt) {
      throw new RpcException(new UnauthorizedException());
    }
    try {
      return this.jwtService.decode(jwt) as UserJwt;
    } catch (error) {
      throw new RpcException(new UnauthorizedException());
    }
  }

  async findUserById(userId: number): Promise<UserEntity> {
    return this.userRepository.findOneById(userId);
  }

  async addFriend(userId: number, friendId: number) {
    const creator = await this.findUserById(userId);
    const receiver = await this.findUserById(friendId);

    if (!creator || !receiver) {
      throw new RpcException(new ConflictException('User not found'));
    }

    const existedFriendRequest =
      await this.friendRequestRepository.findByCondition({
        where: { creator, receiver },
      });

    if (existedFriendRequest) {
      throw new RpcException(new ConflictException('Existed friend request'));
    }

    const createdRequest = this.friendRequestRepository.save({
      creator,
      receiver,
    });

    return createdRequest;
  }

  async getFriends(userId: number) {
    const creator = await this.findUserById(userId);

    return this.friendRequestRepository.findWithRelations({
      where: [{ creator }, { receiver: creator }],
      relations: ['creator', 'receiver'],
    });
  }
}
