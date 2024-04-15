import {
  Catch,
  ArgumentsHost,
  ExceptionFilter,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { RpcException } from '@nestjs/microservices';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}
  catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    let statusCode: number;
    let errorMessage: unknown;
    const ctx = host.switchToHttp();
    // console.log('exception', exception);
    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      errorMessage = exception.getResponse();
    } else if (exception instanceof RpcException) {
      const error = exception.getError() as { statusCode?: number };
      statusCode = error?.statusCode || 400;
      errorMessage = exception.message;
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
