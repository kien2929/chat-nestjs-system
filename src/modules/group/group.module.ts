import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { MongooseModule } from '@nestjs/mongoose';
import { GroupSchema } from 'src/common/schemas/group.schema';
import { GroupMemberSchema } from 'src/common/schemas/group-member.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ schema: GroupSchema, name: 'group' }]),
    MongooseModule.forFeature([
      { schema: GroupMemberSchema, name: 'group_member' },
    ]),
  ],
  providers: [GroupService],
})
export class GroupModule {}
