import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { MessageEntity } from './message.entity';

@Entity('conversation')
export class ConversationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => UserEntity)
  @JoinTable()
  users: UserEntity[];

  @OneToMany(() => MessageEntity, (messageEntity) => messageEntity.conversation)
  messages: MessageEntity[];

  @UpdateDateColumn()
  lastUpdated: Date;
}
