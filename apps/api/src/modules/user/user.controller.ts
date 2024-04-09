import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto, LoginDto } from './dto/user.dto';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '@app/shared';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    @Inject('AUTH_SERVICE') private authService: ClientProxy,
    @Inject('PRESENCE_SERVICE') private presenceService: ClientProxy,
  ) {}

  @Post('register')
  async create(@Body() createUserDto: CreateUserDto) {
    return this.authService.send({ cmd: 'post-user' }, { ...createUserDto });
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.send({ cmd: 'login' }, loginDto);
  }

  @Get()
  async getUser() {
    return this.authService.send({ cmd: 'get-user' }, {});
  }

  @UseGuards(AuthGuard)
  @Get('presence')
  async getPresence() {
    return this.presenceService.send({ cmd: 'get-presence' }, {});
  }
}
