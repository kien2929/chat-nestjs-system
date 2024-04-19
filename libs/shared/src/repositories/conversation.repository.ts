import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseAbstractRepository } from './base/base.abstract.repository';
import { ConversationEntity } from '../entities/conversation.entity';
import { ConversationRepositoryInterface } from '../interfaces/repository/conversation.repository';

@Injectable()
export class ConversationRepository
  extends BaseAbstractRepository<ConversationEntity>
  implements ConversationRepositoryInterface
{
  constructor(
    @InjectRepository(ConversationEntity)
    private readonly conversationRepository: Repository<ConversationEntity>,
  ) {
    super(conversationRepository);
  }
  async findConversation(
    userId: number,
    friendId: number,
  ): Promise<ConversationEntity> {
    return await this.conversationRepository
      .createQueryBuilder('conversation')
      .leftJoin('conversation.users', 'user')
      .where('user.id = :userId', { userId })
      .orWhere('user.id = :friendId', { friendId })
      .groupBy('conversation.id')
      .having('COUNT(*) > 1')
      .getOne();
  }
}
