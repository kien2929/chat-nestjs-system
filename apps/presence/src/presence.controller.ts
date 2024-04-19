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
  ) {}

  @MessagePattern({ cmd: 'get-active-user' })
  @UseInterceptors(CacheInterceptor)
  async getUser(
    @Ctx() context: RmqContext,
    @Payload() payload: { userId: number },
  ) {
    const activeUsers = await this.presenceService.getActiveUser(
      payload.userId,
    );
    this.sharedService.acknowledgeMessage(context);

    return activeUsers;
  }
}
