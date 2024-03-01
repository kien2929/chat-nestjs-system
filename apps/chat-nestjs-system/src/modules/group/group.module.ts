import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { MongooseModule } from '@nestjs/mongoose';
import { GroupSchema } from '../../common/schemas/group.schema';
import { GroupMemberSchema } from '../../common/schemas/group-member.schema';
import { GroupController } from './group.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ schema: GroupSchema, name: 'group' }]),
    MongooseModule.forFeature([
      { schema: GroupMemberSchema, name: 'group_member' },
    ]),
  ],
  providers: [GroupService],
  controllers: [GroupController],
})
export class GroupModule {}
