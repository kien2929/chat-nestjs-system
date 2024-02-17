import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageSchema } from 'src/schemas/Message.schema';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ schema: MessageSchema, name: 'Message' }]),
  ],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule {}
