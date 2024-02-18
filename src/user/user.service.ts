import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  register(body: CreateUserDto) {
    this.userModel.create(body);
  }
}
