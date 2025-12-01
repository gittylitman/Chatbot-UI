import { getConfiguration } from '../infrastructure/configuration/configuration.util';
import { ConfigurationSchema } from '../infrastructure/configuration/schema/configuration.schema';

/**
 * We can't use `ConfigurationService` because NestJS wasn't bootstrapped yet,
 * so lets parse the environment variables ourselves
 */
export function createBootstrapEnv(): Pick<ConfigurationSchema, 'DISABLE_METRICS' | 'METRICS_PORT'> {
  return {
    DISABLE_METRICS: getMetricsDisabled(),
    METRICS_PORT: getMetricsPort(),
  };
}

function getMetricsDisabled(): boolean {
  const asString = getConfiguration('DISABLE_METRICS');
  if (!asString) {
    return false;
  }
  return asString.trim().toLowerCase() === 'true';
}

function getMetricsPort(): number {
  const asString = getConfiguration('METRICS_PORT');
  const disabledMetrics = getMetricsDisabled();

  if (!asString) {
    if (disabledMetrics) {
      return 0;
    } else {
      throw new Error('Missing environment variable: METRICS_PORT');
    }
  }
  const asNumber = Number(asString);
  if (isNaN(asNumber)) {
    throw new Error(`Invalid environment variable: METRICS_PORT = ${asString}`);
  }
  return asNumber;
}
