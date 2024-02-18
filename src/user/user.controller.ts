import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto, LoginDto } from './dto/user.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async create(@Body() body: CreateUserDto) {
    return this.userService.register(body);
  }

  @Post('login')
  async login(@Body() body: LoginDto) {
    return this.userService.login(body);
  }
}
