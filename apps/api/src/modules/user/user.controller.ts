import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { LoginDto } from './dto/user.dto';
import { ClientProxy } from '@nestjs/microservices';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    @Inject('AUTH_SERVICE') private authService: ClientProxy,
    @Inject('PRESENCE_SERVICE') private presenceService: ClientProxy,
  ) {}

  @Post()
  async create() {
    return this.authService.send({ cmd: 'post-user' }, {});
  }

  @Post('login')
  async login(@Body() body: LoginDto) {
    return this.userService.login(body);
  }

  @Get()
  async getUser() {
    return this.authService.send({ cmd: 'get-user' }, {});
  }

  @Get('/presence')
  async getPresence() {
    return this.presenceService.send({ cmd: 'get-presence' }, {});
  }
}
