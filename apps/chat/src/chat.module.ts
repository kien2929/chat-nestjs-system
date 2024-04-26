import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import {
  ConversationRepository,
  FriendRequestEntity,
  MessageRepository,
  PostGresDBModule,
  RedisModule,
  SharedModule,
  UserEntity,
} from '@app/shared';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    PostGresDBModule,
    RedisModule,
    SharedModule.RegisterRmq('AUTH_SERVICE', process.env.RABBITMQ_AUTH_QUEUE),
    SharedModule.RegisterRmq(
      'PRESENCE_SERVICE',
      process.env.RABBITMQ_PRESENCE_QUEUE,
    ),
    TypeOrmModule.forFeature([
      UserEntity,
      FriendRequestEntity,
      ConversationRepository,
      MessageRepository,
    ]),
  ],
  controllers: [ChatController],
  providers: [
    ChatService,
    ChatGateway,
    {
      provide: 'ConversationRepositoryInterface',
      useClass: ConversationRepository,
    },
    {
      provide: 'MessageRepositoryInterface',
      useClass: MessageRepository,
    },
  ],
})
export class ChatModule {}
