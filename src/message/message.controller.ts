import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto, GetPagingMessageQueryDto } from './dto/message.dto';

@Controller('message')
export class MessageController {
  constructor(private messageService: MessageService) {}

  @Get()
  async getPaging(@Query() query: GetPagingMessageQueryDto) {
    return this.messageService.getPaging(query);
  }

  @Post()
  async create(@Body() body: CreateMessageDto) {
    return this.messageService.create(body);
  }
}
