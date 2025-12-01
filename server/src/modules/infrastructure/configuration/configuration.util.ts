import { ConfigurationSchema } from './schema/configuration.schema';

/**
 * Gets a configuration variable from the environment
 *
 * Prefer to use `ConfigurationService` instead.
 *
 * This is useful before NestJS started, so before we have an `ConfigurationService` instance.
 */
export function getConfiguration(key: keyof ConfigurationSchema): string | undefined {
  return process.env[key];
}
