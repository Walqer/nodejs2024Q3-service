// src/common/error-handler.service.ts
import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { HttpException } from '@nestjs/common';
import { StatusCodes } from 'http-status-codes';

@Injectable()
export class ErrorHandlerService {
  handleError(error: unknown, res: Response) {
    if (error instanceof HttpException) {
      return res.status(error.getStatus()).send(error.message);
    } else {
      console.error('Unexpected error:', error);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send('Internal Server Error');
    }
  }
}
