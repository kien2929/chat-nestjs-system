import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SharedModule, RedisModule } from '@app/shared';
import { PresenceController } from './presence.controller';
import { PresenceService } from './presence.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
    SharedModule,
    RedisModule,
  ],
  controllers: [PresenceController],
  providers: [PresenceService],
})
export class PresenceModule {}
