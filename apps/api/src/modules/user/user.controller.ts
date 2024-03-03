import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto, LoginDto } from './dto/user.dto';
import { UserResponse } from './model/user.model';
import { instanceToPlain } from 'class-transformer';
import { ClientProxy } from '@nestjs/microservices';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    @Inject('AUTH_SERVICE') private authService: ClientProxy,
  ) {}

  @Post()
  @ApiCreatedResponse({ type: UserResponse })
  async create(@Body() body: CreateUserDto) {
    return this.userService.register(body);
  }

  @Post('login')
  async login(@Body() body: LoginDto) {
    return this.userService.login(body);
  }

  @Get()
  async getUser() {
    return this.authService.send({ cmd: 'get-user' }, {});
  }
}