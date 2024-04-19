import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto, LoginDto } from './dto/user.dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { AuthGuard, UserRequest, UserInterceptor } from '@app/shared';
import { catchError, throwError } from 'rxjs';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    @Inject('AUTH_SERVICE') private authService: ClientProxy,
    @Inject('PRESENCE_SERVICE') private presenceService: ClientProxy,
  ) {}

  @Post('register')
  async create(@Body() createUserDto: CreateUserDto) {
    return this.authService
      .send({ cmd: 'post-user' }, { ...createUserDto })
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService
      .send({ cmd: 'login' }, loginDto)
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }

  @Get()
  async getUser() {
    return this.authService
      .send({ cmd: 'get-user' }, {})
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(UserInterceptor)
  @Get('get-active-user')
  async getPresence(@Req() req: UserRequest) {
    return this.presenceService
      .send({ cmd: 'get-presence' }, { userId: req.user.id })
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(UserInterceptor)
  @Post('add-friend/:friendId')
  async addFriend(
    @Req() req: UserRequest,
    @Param('friendId') friendId: number,
  ) {
    if (!req?.user) {
      throw new RpcException(new BadRequestException());
    }

    return this.authService
      .send({ cmd: 'add-friend' }, { friendId: +friendId, userId: req.user.id })
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(UserInterceptor)
  @Get('get-friends')
  async getFriends(@Req() req: UserRequest) {
    if (!req?.user) {
      throw new BadRequestException();
    }
    return this.authService
      .send({ cmd: 'get-friends' }, { userId: req.user.id })
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }
}
