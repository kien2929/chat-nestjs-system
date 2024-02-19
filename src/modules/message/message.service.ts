import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Message } from 'src/common/schemas/message.schema';
import { CreateMessageDto, GetPagingMessageQueryDto } from './dto/message.dto';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class MessageService {
  constructor(@InjectModel('Message') private messageModel: Model<Message>) {}

  getPaging(query: GetPagingMessageQueryDto) {
    return this.messageModel
      .find({ messageFrom: query.messageFrom, messageTo: query.messageTo })
      .limit(query.pageSize)
      .sort({ _id: -1 })
      .skip(query.pageSize * query.pageNumber)
      .exec()
      .then((res) => res.reverse());
  }

  create(body: CreateMessageDto) {
    return this.messageModel.create(body);
  }
}
