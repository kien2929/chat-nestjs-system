import { Inject, Injectable } from '@nestjs/common';
import {
  ConversationRepositoryInterface,
  FriendRequestRepositoryInterface,
  MessageEntity,
  MessageRepositoryInterface,
  UserRepositoryInterface,
} from '@app/shared';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { NewMessageDTO } from './dto/new-message.dto';

@Injectable()
export class ChatService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
    @Inject('ConversationRepositoryInterface')
    private readonly conversationRepository: ConversationRepositoryInterface,
    @Inject('MessageRepositoryInterface')
    private readonly messageRepository: MessageRepositoryInterface,
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
    @Inject('FriendRequestRepositoryInterface')
    private readonly friendRequestRepository: FriendRequestRepositoryInterface,
  ) {}

  private async getUser(id: number) {
    const observer = this.authService.send({ cmd: 'get_user' }, { id });

    const user = await firstValueFrom(observer).catch((err) => {
      console.log(err);
    });

    return user;
  }

  async createMessage(
    userId: number,
    newMessage: NewMessageDTO,
  ): Promise<MessageEntity> {
    const user = await this.getUser(userId);

    if (!user) return;
    const conversation = await this.conversationRepository.findOneById(
      newMessage.conversationId,
    );

    if (!conversation) return;

    return await this.messageRepository.save({
      message: newMessage.message,
      conversation,
      user,
    });
  }

  async createConversation(friendId: number, userId: number) {
    const friend = await this.getUser(friendId);
    const user = await this.getUser(userId);

    if (!user || !friend) return;

    const existedConversation =
      await this.conversationRepository.findByCondition({
        where: { users: [friend, user] },
      });

    if (existedConversation) return existedConversation;

    const conversation = await this.conversationRepository.create({
      users: [user, friend],
    });

    return conversation;
  }

  async getConversations(userId: number) {
    // const conversations = await this.conversationRepository.findWithRelations({
    //  where: { users: { id: userId } },
    //  relations: ['users'],
    // });
    const allConversations =
      await this.conversationRepository.findWithRelations({
        relations: ['users'],
      });

    const userConversations = allConversations.filter((conversation) => {
      const userIds = conversation.users.map((user) => user.id);
      return userIds.includes(userId);
    });

    return userConversations.map((conversation) => ({
      id: conversation.id,
      userIds: (conversation?.users ?? []).map((user) => user.id),
    }));
  }
}
