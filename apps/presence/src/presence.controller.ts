import { Controller, Inject, UseInterceptors } from '@nestjs/common';
import { CACHE_MANAGER, CacheInterceptor } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { SharedService } from '@app/shared';
import { PresenceService } from './presence.service';
import { ActiveUser } from './interfaces/active-user.interface';

@Controller()
export class PresenceController {
  constructor(
    private readonly sharedService: SharedService,
    private readonly presenceService: PresenceService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  @MessagePattern({ cmd: 'get-presence' })
  @UseInterceptors(CacheInterceptor)
  async getUser(
    @Ctx() context: RmqContext,
    @Payload() payload: { userId: number },
  ) {
    const friends = await this.presenceService.getFriends(payload.userId);
    const activeUsers = [];
    console.log({ friends });
    for (const friend of friends) {
      // TODO: FIX IT
      const activeUser = await this.cacheManager.get<ActiveUser>(
        `user ${friend.id}`,
      );
      console.log({ activeUser });
      if (!activeUser || !activeUser.isActive) continue;

      activeUsers.push(activeUser);
    }

    this.sharedService.acknowledgeMessage(context);

    return activeUsers;
  }
}
