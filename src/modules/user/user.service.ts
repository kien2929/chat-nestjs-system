import { Injectable } from '@nestjs/common';
import { CreateUserDto, LoginDto } from './dto/user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/common/schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel('user') private userModel: Model<User>) {}

  async register(body: CreateUserDto) {
    return this.userModel.create(body);
  }

  async login(body: LoginDto) {
    const user = await this.userModel.findOne({ username: body.username });
    const response = await user.login(user, body.password);
    return response;
  }
}
