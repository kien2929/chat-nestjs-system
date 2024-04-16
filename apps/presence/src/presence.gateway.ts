import { Cache } from 'cache-manager';
import { Inject } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { UserJwt } from '@app/shared';
import { ActiveUser } from './interfaces/active-user.interface';
import { PresenceService } from './presence.service';

@WebSocketGateway({ cors: true })
export class PresenceGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly presenceService: PresenceService,
  ) {}

  @WebSocketServer()
  server: Server;

  private async setActiveStatus(socket: Socket, isActive: boolean) {
    const user = socket.data?.user;

    if (!user) return;

    const activeUser: ActiveUser = {
      id: user.id,
      socketId: socket.id,
      isActive,
    };

    await this.cacheManager.set(`user ${user.id}`, activeUser, 0);
    await this.emitStatusToFriends(activeUser);
  }

  async emitStatusToFriends(activeUser: ActiveUser) {
    const friends = await this.presenceService.getFriends(activeUser.id);

    if (!friends || !friends.length) return;

    for (const friend of friends) {
      const friendActiveUser = await this.cacheManager.get<ActiveUser>(
        `user ${friend.id}`,
      );

      if (!friendActiveUser) continue;

      this.server.to(friendActiveUser.socketId).emit('friendActive', {
        id: activeUser.id,
        isActive: activeUser.isActive,
      });
    }
  }

  @SubscribeMessage('updateActiveStatus')
  async updateActiveStatus(socket: Socket, isActive: boolean) {
    if (!socket.data?.user) return;

    await this.setActiveStatus(socket, isActive);
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
    await this.setActiveStatus(socket, true);
  }

  async handleDisconnect(socket: Socket) {
    const user = socket.data?.user;

    if (!user) return socket.disconnect();

    const activeUser: ActiveUser = {
      id: user.id,
      socketId: socket.id,
      isActive: false,
    };

    await this.cacheManager.set(`user ${user.id}`, activeUser, 0);
    await this.emitStatusToFriends(activeUser);
    return socket.disconnect();
  }
}
