import { DataSource, DataSourceOptions } from 'typeorm';
import { UserEntity, FriendRequestEntity } from '@app/shared';

export const dataSourceOption: DataSourceOptions = {
  type: 'postgres',
  url: process.env.POSTGRES_URI,
  entities: [UserEntity, FriendRequestEntity],
  migrations: ['dist/apps/auth/db/migrations/*.js'],
};

export const dataSource = new DataSource(dataSourceOption);
