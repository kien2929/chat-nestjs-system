import { UserEntity, BaseInterfaceRepository } from '@app/shared';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UserRepositoryInterface
  extends BaseInterfaceRepository<UserEntity> {}
