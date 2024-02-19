import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { MessageModule } from './modules/message/message.module';
import { GroupModule } from './modules/group/group.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_CONNECTION_STRING, {
      dbName: process.env.MONGODB_DATABASE_NAME,
    }),
    UserModule,
    MessageModule,
    GroupModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
