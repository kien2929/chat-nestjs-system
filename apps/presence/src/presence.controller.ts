import { Controller } from '@nestjs/common';
import { Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';
import { SharedService } from '@app/shared';
import { AuthGuard } from '@app/shared/auth.guard';
import { PresenceService } from './presence.service';

@Controller()
export class PresenceController {
  constructor(
    private readonly presenceService: PresenceService,
    private readonly sharedService: SharedService,
    // TODO: remove it
    private readonly authGuard: AuthGuard,
  ) {}

  @MessagePattern({ cmd: 'get-presence' })
  async getUser(@Ctx() context: RmqContext) {
    this.sharedService.acknowledgeMessage(context);
    // TODO: remove it
    console.log(123, this.authGuard.hasJwt());
    return this.presenceService.getPresence();
  }
}
