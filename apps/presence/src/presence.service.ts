import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { FriendRequestEntity, RedisService } from '@app/shared';
import { firstValueFrom } from 'rxjs';
import { ActiveUser } from './interfaces/active-user.interface';

@Injectable()
export class PresenceService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
    private readonly redisService: RedisService,
  ) {}

  async getFriendsList(userId: number) {
    const observable = this.authService.send<FriendRequestEntity[]>(
      { cmd: 'get-friends-list' },
      { userId },
    );

    const friendsList = await firstValueFrom(observable).catch((error) => {
      console.error(error);
    });

    if (!friendsList) return [];

    return friendsList;
  }

  async getActiveUser(userId: number): Promise<ActiveUser> {
    return await this.redisService.get<ActiveUser>(`user ${userId}`);
  }
}
