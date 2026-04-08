import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';
    let error = 'Internal Server Error';

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        const res = exceptionResponse as Record<string, unknown>;
        message = (res.message as string | string[]) || exception.message;
        error = (res.error as string) || this.getErrorName(statusCode);
      }

      error = error || this.getErrorName(statusCode);
    } else if (this.isMongooseValidationError(exception)) {
      statusCode = HttpStatus.BAD_REQUEST;
      error = 'Validation Error';
      const validationError = exception as { errors: Record<string, { message: string }> };
      const fieldMessages: string[] = [];

      for (const field of Object.keys(validationError.errors)) {
        fieldMessages.push(validationError.errors[field].message);
      }

      message = fieldMessages.length > 0 ? fieldMessages : 'Validation failed';
    }

    response.status(statusCode).json({
      statusCode,
      message,
      error,
      timestamp: new Date().toISOString(),
    });
  }

  private isMongooseValidationError(exception: unknown): boolean {
    return (
      exception !== null &&
      typeof exception === 'object' &&
      (exception as Record<string, unknown>).name === 'ValidationError' &&
      typeof (exception as Record<string, unknown>).errors === 'object'
    );
  }

  private getErrorName(statusCode: number): string {
    const names: Record<number, string> = {
      400: 'Bad Request',
      401: 'Unauthorized',
      403: 'Forbidden',
      404: 'Not Found',
      409: 'Conflict',
      422: 'Unprocessable Entity',
      500: 'Internal Server Error',
    };
    return names[statusCode] || 'Error';
  }
}
