import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../../common/schemas/user.schema';
import { UserController } from './user.controller';
import { SharedModule } from '@app/shared';

@Module({
  imports: [
    MongooseModule.forFeature([{ schema: UserSchema, name: 'user' }]),
    SharedModule.RegisterRmq('AUTH_SERVICE', process.env.RABBITMQ_AUTH_QUEUE),
    SharedModule.RegisterRmq(
      'PRESENCE_SERVICE',
      process.env.RABBITMQ_PRESENCE_QUEUE,
    ),
  ],
  controllers: [UserController],
})
export class UserModule {}
