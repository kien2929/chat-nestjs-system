import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ConversationEntity } from './conversation.entity';
import { UserEntity } from './user.entity';

@Entity('message')
export class MessageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message: string;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.messages)
  user: UserEntity;

  @ManyToOne(
    () => ConversationEntity,
    (conversationEntity) => conversationEntity.messages,
  )
  conversation: ConversationEntity;

  @CreateDateColumn()
  createdAt: Date;
}
