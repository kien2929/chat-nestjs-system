import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/common/schemas/user.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [MongooseModule.forFeature([{ schema: UserSchema, name: 'user' }])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
