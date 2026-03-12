import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let message: string;
    let code: string | undefined;

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const res = exceptionResponse as Record<string, unknown>;
      message = Array.isArray(res.message)
        ? (res.message as string[]).join(', ')
        : (res.message as string) || exception.message;
      code = res.code as string | undefined;
    } else {
      message = exception.message;
    }

    response.status(status).json({
      message,
      status,
      ...(code && { code }),
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
