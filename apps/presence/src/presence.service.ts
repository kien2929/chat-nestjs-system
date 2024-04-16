import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { FriendRequestEntity } from '@app/shared';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PresenceService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
  ) {}

  async getFriends(userId: number) {
    const observable = this.authService.send<FriendRequestEntity[]>(
      { cmd: 'get-friends' },
      { userId },
    );

    const friendRequests = await firstValueFrom(observable).catch((error) => {
      console.error(error);
    });

    if (!friendRequests) return;

    const friends = friendRequests.map((friendRequest: FriendRequestEntity) => {
      const isCreator = userId === friendRequest.creator.id;
      const friendDetail = isCreator
        ? friendRequest.receiver
        : friendRequest.creator;

      const { id, firstName, lastName, email } = friendDetail;

      return { id, firstName, lastName, email };
    });

    return friends;
  }
}
