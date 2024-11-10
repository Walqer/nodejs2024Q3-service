// src/common/filters/http-exception.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { ErrorHandlerService } from '../error-handler.service';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly errorHandlerService: ErrorHandlerService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    this.errorHandlerService.handleError(exception, response);
  }
}
