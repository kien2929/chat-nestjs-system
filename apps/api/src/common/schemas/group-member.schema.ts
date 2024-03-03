import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type GroupMemberDocument = HydratedDocument<GroupMember>;

@Schema()
export class GroupMember {
  @Prop({ required: true })
  groupId: string;

  @Prop({ required: true })
  userId: string;
}

export const GroupMemberSchema = SchemaFactory.createForClass(GroupMember);
