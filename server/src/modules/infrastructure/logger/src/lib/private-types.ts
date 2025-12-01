import { LogLevel } from './logger.interface';

export type ConcreteLogger = Record<LogLevel, (data: Record<string, unknown>, message: string) => void> & {
  flush(): void;
};

export type ConcreteLoggerConfiguration = Partial<{
  level: 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace' | 'silent';
  prettyPrint: boolean;
  formatters: {
    level(label: string, number: number): { level: number; level_name: string };
    bindings(bindings: unknown): Record<never, never>;
  };
  messageKey: string;
  mixin():
    | Record<never, never>
    | {
        trace_id: string;
        span_id: string;
        trace_flags: string;
        service: string;
      };
}>;

export type ConcreteLoggerFactory = (
  configuration: ConcreteLoggerConfiguration,
  destination?: { write(msg: string): void },
) => ConcreteLogger;

type SerializedError = {
  type: string;
  message: string;
  stack: string;
  raw: Error;
  [key: string]: unknown;
  [key: number]: unknown;
};

export type ErrorSerializer = (error: Error) => SerializedError;

export type ContextStorage = {
  getStore(): Record<string, unknown> | undefined;
};
