import { CtxAsyncLocalStorage } from './loggerCtx';
import { Injectable } from '@nestjs/common';
import { Logger } from '../../modules/infrastructure/logger';

@Injectable()
export class ServiceLogger extends Logger {
  constructor() {
    super(
      { level: process.env.LOG_LEVEL ? (process.env.LOG_LEVEL as never) : 'trace', name: 'chat-service' },
      CtxAsyncLocalStorage,
    );
  }
}
