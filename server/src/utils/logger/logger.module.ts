import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AddCtxToLoggerMiddleware } from './logger.middleware';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './logging.interceptor';
import { ServiceLogger } from './logger';

@Module({
  imports: [],
  providers: [
    ServiceLogger,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
  exports: [ServiceLogger],
})
export class LoggerModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AddCtxToLoggerMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
