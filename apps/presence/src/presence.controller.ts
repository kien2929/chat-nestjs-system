import { Controller, UseInterceptors } from '@nestjs/common';
import { Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';
import { SharedService, RedisService } from '@app/shared';
import { PresenceService } from './presence.service';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller()
export class PresenceController {
  constructor(
    private readonly redisService: RedisService,
    private readonly presenceService: PresenceService,
    private readonly sharedService: SharedService,
  ) {}

  @MessagePattern({ cmd: 'get-presence' })
  @UseInterceptors(CacheInterceptor)
  async getUser(@Ctx() context: RmqContext) {
    this.sharedService.acknowledgeMessage(context);
    const foo = await this.redisService.get('foo');
    if (!foo) {
      const realFoo = await this.presenceService.getPresence();
      await this.redisService.set('foo', realFoo);
      return realFoo;
    }
    console.log('from cache');
    return foo;
  }
}
