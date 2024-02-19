import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { MessageService } from './message.service';
import { CreateMessageDto, GetPagingMessageQueryDto } from './dto/message.dto';
import { MessageModelResponse } from './model/message.model';

@ApiTags('message')
@Controller('message')
export class MessageController {
  constructor(private messageService: MessageService) {}

  @ApiOkResponse({
    type: [MessageModelResponse],
  })
  @Get()
  async getPaging(@Query() query: GetPagingMessageQueryDto) {
    return this.messageService.getPaging(query);
  }

  @ApiCreatedResponse({
    type: MessageModelResponse,
  })
  @Post()
  async create(@Body() body: CreateMessageDto) {
    return this.messageService.create(body);
  }
}
