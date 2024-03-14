import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpExceptionsFilter } from './common/exceptions/http.exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Chat nestjs system')
    .setDescription('Chat nestjs system API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe());
  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new HttpExceptionsFilter(httpAdapter));
  await app.listen(3003);
}
bootstrap();
