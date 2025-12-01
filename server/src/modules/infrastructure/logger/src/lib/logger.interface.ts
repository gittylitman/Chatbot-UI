export interface LogMetadata extends Record<string, unknown> {
  error?: unknown;
}

export interface LoggerConfiguration {
  name?: string;
  /** prettyPrint shouldn't be used in production, but it's fine in development/testing */
  prettyPrint?: boolean;
  level?: 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace' | 'silent'; // Internal implementation-specific log level
  /** If provided, write to file at this path instead of stdout, otherwise write to stdout */
  outputStream?: { write(msg: string): void };
}

// Applicative log level
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LoggerInterface extends Record<LogLevel, (message: string, metadata?: LogMetadata) => void> {
  /**
   * Debug logs add details required when diagnosing system behavior and when troubleshooting errors.
   * @param message
   * @param metadata
   */
  debug(message: string, metadata?: LogMetadata): void;

  /**
   * Information logs record meaningful business events.
   * It is best practice to consult with your team mates
   * (or other relevant stakeholders, like product, operations, devops etc.)
   * regarding what business events should be logged.
   * @param message
   * @param metadata
   */
  info(message: string, metadata?: LogMetadata): void;

  /**
   * Warning logs indicate actionable / recoverable error: something went wrong but there is a specific person / team in the organization that is assigned to handle the error.
   * @param message
   * @param metadata
   */
  warn(message: string, metadata?: LogMetadata): void;

  /**
   * Error logs are unexpected failures that are reported on the production errors slack channel. The dev on call is assigned to them.
   * @param message
   * @param metadata
   */
  error(message: string, metadata?: LogMetadata): void;

  addMetadata(metadata: Record<string, string | number>): void;

  /** Write pending logs to destination. Useful for graceful shutdown, ensuring we don't lose logs */
  flush(): void;
}
