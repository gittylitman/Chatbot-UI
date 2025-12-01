import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';
import * as _ from 'lodash';
import { ServiceLogger } from './logger';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: ServiceLogger) { }

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    this.logger.addMetadata({
      handlerName: context.getHandler().name,
      controllerName: context.getClass().name,
    });

    return next.handle().pipe(
      tap((data) => {
        if (context.getType() === 'http') {
          const response = context.switchToHttp().getResponse<Response>();
          const request = context.switchToHttp().getRequest<Request>();
          const userAgent = request.headers['user-agent'];
          let requestString: string | undefined = undefined;
          let resultString: string | undefined = undefined;

          try {
            requestString = _.truncate(JSON.stringify(request.body), { length: 1200 });
            resultString = _.truncate(JSON.stringify(data), { length: 1200 });
          } catch (error) {
            this.logger.error('Cant get requestString or resultString', {
              'event.action': 'RequestError',
              'log.level': 'error',
              error,
            })
          }
          this.logger.info('request end', {
            'event.action': 'RequestInfo',
            'log.level': 'info',
            event: {
              status: response.statusCode,
              userAgent,
              result: resultString,
              request: requestString,
            }
          });
        }
      }),
    );
  }
}
