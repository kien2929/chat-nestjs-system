import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions } from '@nestjs/microservices';
import { SharedService } from '@app/shared';
import { PresenceModule } from './presence.module';

async function bootstrap() {
  const app = await NestFactory.create(PresenceModule);
  const configService = app.get(ConfigService);
  const sharedService = app.get(SharedService);
  const queue = configService.get('RABBITMQ_PRESENCE_QUEUE');
  app.enableCors();

  app.connectMicroservice<MicroserviceOptions>(
    sharedService.getRmqOptions(queue),
  );
  await app.startAllMicroservices();
  await app.listen(6000);
}
bootstrap();
