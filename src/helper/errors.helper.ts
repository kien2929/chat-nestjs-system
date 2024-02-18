import {
  Catch,
  ArgumentsHost,
  ExceptionFilter,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class HttpExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}
  catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    let statusCode: number;
    let errorMessage: unknown;
    const ctx = host.switchToHttp();
    console.log('exception', exception);
    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      errorMessage = exception.getResponse();
    } else {
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      errorMessage = 'Internal Server Error';
    }

    const errorResponse = {
      statusCode,
      message: errorMessage,
    };
    httpAdapter.reply(ctx.getResponse(), errorResponse, statusCode);
  }
}
