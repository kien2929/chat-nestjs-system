import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageSchema } from 'src/common/schemas/message.schema';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ schema: MessageSchema, name: 'message' }]),
  ],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule {}
