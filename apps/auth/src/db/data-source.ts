import { DataSource, DataSourceOptions } from 'typeorm';
import {
  UserEntity,
  FriendRequestEntity,
  ConversationEntity,
  MessageEntity,
} from '@app/shared';

export const dataSourceOption: DataSourceOptions = {
  type: 'postgres',
  url: process.env.POSTGRES_URI,
  entities: [
    UserEntity,
    FriendRequestEntity,
    ConversationEntity,
    MessageEntity,
  ],
  migrations: ['dist/apps/auth/db/migrations/*.js'],
};

export const dataSource = new DataSource(dataSourceOption);
