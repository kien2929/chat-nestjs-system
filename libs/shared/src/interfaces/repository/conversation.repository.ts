import { ConversationEntity, BaseInterfaceRepository } from '@app/shared';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ConversationRepositoryInterface
  extends BaseInterfaceRepository<ConversationEntity> {
  findConversation(
    userId: number,
    friendId: number,
  ): Promise<ConversationEntity>;
}
