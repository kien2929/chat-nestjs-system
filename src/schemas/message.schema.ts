import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MessageDocument = HydratedDocument<Message>;

@Schema()
export class Message {
  @Prop({ required: true })
  messageFrom: string;

  @Prop({ required: true })
  messageTo: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: false, default: new Date() })
  createdAt: Date;

  @Prop({ required: false, default: 1 })
  type: number;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
