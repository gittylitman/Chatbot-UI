import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { CtxAsyncLocalStorage } from './loggerCtx';

@Injectable()
export class AddCtxToLoggerMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: () => void): void {
    const path = req.originalUrl;
    const method = req.method;
    CtxAsyncLocalStorage.run({ path, method }, () => {
      next();
    });
  }
}
