import { HealthCheckError, HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';

export class SoftShutdownService extends HealthIndicator {
  private isSoftShutdown = false;

  public shutdown(): void {
    this.isSoftShutdown = true;
  }

  public check(key = 'softShutdown'): Promise<HealthIndicatorResult> {
    const isHealthy = !this.isSoftShutdown;
    const result = this.getStatus(key, isHealthy);
    if (!isHealthy) {
      return Promise.reject(new HealthCheckError('Soft shut down', result));
    }
    return Promise.resolve(result);
  }
}
