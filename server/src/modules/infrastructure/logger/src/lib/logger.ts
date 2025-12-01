import _ from 'lodash';
import safeJsonStringify from 'safe-json-stringify';
import { AsyncLocalStorage } from 'async_hooks';
import { LoggerConfiguration, LoggerInterface, LogLevel, LogMetadata } from './logger.interface';
import { ConcreteLoggerFactory, ContextStorage, ErrorSerializer } from './private-types';
import pino from 'pino';

export class Logger implements LoggerInterface {
  private pino: pino.Logger;

  public constructor(
    private readonly configuration: LoggerConfiguration,
    private readonly contextStorage: ContextStorage = new AsyncLocalStorage<Record<string, unknown>>(),
    private readonly loggerFactory: ConcreteLoggerFactory = pino,
    private readonly errorSerializer: ErrorSerializer = pino.stdSerializers.err,
  ) {
    // Gracefully handle users passing falsy to optional parameters:
    this.contextStorage ||= new AsyncLocalStorage<Record<string, unknown>>();
    this.loggerFactory ||= pino;
    this.errorSerializer ||= pino.stdSerializers.err;

    const logger = this.loggerFactory(
      {
        level: this.configuration?.level ?? 'trace',
        // Pino prettyPrint option is no longer supported, see the pino-pretty package (https://github.com/pinojs/pino-pretty)
        ...(this.configuration?.prettyPrint && {
          transport: {
            target: 'pino-pretty',
            options: {
              colorize: true,
              sync: true, // Jest requires no asynchronous operation to continue after the test has finished
            },
          },
        }),
        formatters: {
          level: (label: string, number: number) => {
            return { level: number, level_name: label };
          },
          bindings: (_bindings: pino.Bindings) => {
            return {};
          },
        },
        messageKey: 'message',
        // mixin: () => {}, // here you can config additional fields to be added to every log
      },
      this.configuration?.outputStream ?? process.stdout,
    );
    this.pino = logger as never;
  }

  public debug(message: string, metadata?: LogMetadata): void {
    this.processLog('debug', message, metadata);
  }

  public info(message: string, metadata?: LogMetadata): void {
    this.processLog('info', message, metadata);
  }

  public warn(message: string, metadata?: LogMetadata): void {
    this.processLog('warn', message, metadata);
  }

  public error(message: string, metadata?: LogMetadata): void {
    this.processLog('error', message, metadata);
  }

  public addMetadata(metadata: Record<string, string | number>): void {
    const store = this.contextStorage.getStore();
    if (store) {
      Object.assign(store, metadata);
    }
  }

  public flush(): void {
    this.pino.flush();
  }

  private processLog(level: LogLevel, message: string, metadata?: LogMetadata) {
    const data = serializeMetadata(metadata);
    const serializedError = this.serializeError(metadata?.error);
    const context = this.contextStorage.getStore() || {};
    this.pino[level]({ ...context, logData: data, ...(serializedError && { error: serializedError }) }, message);
  }

  private serializeError(error: unknown | undefined): string | undefined {
    return (error as never) && JSON.stringify(this.errorSerializer(cleanAxiosError(error as never)));
  }
}

type MaybeAxiosError = Error &
  Partial<{
    isAxiosError: boolean;
    request: unknown;
    config: unknown;
    response: Record<string, unknown>;
  }>;

function serializeMetadata(metadata: LogMetadata | undefined): Record<string, unknown> | undefined {
  if (!metadata) {
    return undefined;
  }
  const notError = _.omit(metadata, 'error');
  const serialized = _.mapValues(notError, (o: unknown) => (_.isObject(o) ? (safeJsonStringify(o) as string) : o));
  return serialized as never;
}

function cleanAxiosError(error: MaybeAxiosError): MaybeAxiosError {
  if (!error?.isAxiosError) {
    return error;
  }
  const withoutIrrelevant = _.omit(error, ['request', 'config']);
  const relevantResponse = _.pick(error.response, ['status', 'statusText', 'headers', 'config', 'baseURL']);
  const cleaned = {
    ...withoutIrrelevant,
    response: relevantResponse,
  };
  return cleaned as never;
}
