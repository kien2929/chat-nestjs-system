import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendRequestEntity } from '../entities/friend-request.entity';
import { BaseAbstractRepository } from './base/base.abstract.repository';
import { FriendRequestRepositoryInterface } from '../interfaces/repository/friend-request.repository';

@Injectable()
export class FriendRequestRepository
  extends BaseAbstractRepository<FriendRequestEntity>
  implements FriendRequestRepositoryInterface
{
  constructor(
    @InjectRepository(FriendRequestEntity)
    private readonly friendRequestRepository: Repository<FriendRequestEntity>,
  ) {
    super(friendRequestRepository);
  }
}
