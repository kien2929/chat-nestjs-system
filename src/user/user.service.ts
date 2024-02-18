import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto, LoginDto } from './dto/user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async register(body: CreateUserDto) {
    return this.userModel.create(body);
  }

  async login(body: LoginDto) {
    const user = await this.userModel.findOne({ username: body.username });
    const isMatch = user && (await user.validatePassword(body.password));
    if (!isMatch) {
      throw new HttpException('Username or password is incorrect', 400);
    }
    return user;
  }
}
