import { Inject } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { ClientProxy } from '@nestjs/microservices';
import { MessageEntity, RedisService, UserJwt } from '@app/shared';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { firstValueFrom } from 'rxjs';
import { NewMessageDTO } from './dto/new-message.dto';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
    @Inject('PRESENCE_SERVICE') private readonly presenceService: ClientProxy,
    private readonly cache: RedisService,
    private readonly chatService: ChatService,
  ) {}

  @WebSocketServer()
  server: Server;

  handleDisconnect(socket: Socket) {
    console.log('Disconnected', socket.id);
    return;
  }

  async handleConnection(socket: Socket) {
    const jwt = socket.handshake.headers.authorization ?? null;

    if (!jwt) return this.handleDisconnect(socket);

    const observable = this.authService.send<UserJwt>(
      { cmd: 'decode-jwt' },
      { jwt },
    );
    const response = await firstValueFrom(observable).catch((error) => {
      console.error(error);
    });

    if (!response || !response?.user) return this.handleDisconnect(socket);

    const { user } = response;
    socket.data.user = user;
    await this.setConversationUser(socket);
    await this.getConversations(socket);
  }
  @SubscribeMessage('getConversations')
  async getConversations(socket: Socket) {
    const { user } = socket.data;

    if (!user) return;

    const conversations = await this.chatService.getConversations(user.id);
    this.server.to(socket.id).emit('getAllConversations', conversations);
  }
  async setConversationUser(socket: Socket) {
    const { user } = socket.data;

    if (!user || !user.id) return;
    const conversationUser = { id: user.id, socketId: socket.id };

    await this.cache.set(`conversationUser:${user.id}`, conversationUser);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(socket: Socket, newMessage: NewMessageDTO) {
    if (!newMessage) return;

    const { user } = socket.data;

    if (!user) return;

    const createMessage = await this.chatService.createMessage(
      user.id,
      newMessage,
    );

    const observable = this.presenceService.send(
      { cmd: 'get-active-user' },
      { id: newMessage.friendId },
    );

    const activeFriends = await firstValueFrom(observable).catch((error) => {
      console.error(error);
    });

    if (!activeFriends || !activeFriends.isActive) return;

    const friendDetails = (await this.cache.get(
      `conversation ${newMessage.friendId}`,
    )) as { id: number; socketId: string } | undefined;

    const { id, message, user: creator, conversation } = createMessage;

    this.server.to(friendDetails?.socketId).emit('newMessage', {
      id,
      message,
      creatorId: creator.id,
      conversationId: conversation.id,
    });
  }
}
