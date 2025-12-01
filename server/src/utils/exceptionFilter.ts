import { ArgumentsHost, Catch, HttpException, HttpStatus, HttpServer } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { ServiceLogger } from './logger/logger';
import * as _ from 'lodash';
@Catch(Error)
export class HttpExceptionFilter extends BaseExceptionFilter {
  constructor(private readonly logger: ServiceLogger, applicationRef?: HttpServer) {
    super(applicationRef);
  }

  override catch(error: Error, host: ArgumentsHost): void {
    super.catch(error, host);
    try {
      let requestString: string | undefined;

      if (host.getType() === 'http') {
        requestString = _.truncate(JSON.stringify(host.switchToHttp().getRequest().body), { length: 1200 });
      }

      const errorMessage = `Uncaught Error, "${error.message}"`;

      if (error instanceof HttpException && error.getStatus() != HttpStatus.INTERNAL_SERVER_ERROR) {
        this.logger.warn(errorMessage, {
          'event.action': 'RequestWatn',
          'log.level': 'warn',
          error: {
            error,
            request: requestString
          }
        })
      } else {
        this.logger.error(errorMessage, {
          'event.action': 'RequestError',
          'log.level': 'error',
          error: {
            error,
            request: requestString
          }
        })
      }
    } catch (error) {
      this.logger.error('Failed to parse error', {
        'event.action': 'RequestError',
        'log.level': 'error',
        error,
      })
    }
  }
}
