import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, HealthCheck, HealthCheckResult } from '@nestjs/terminus';
import { metricsPort } from '../../bootstrap/port-handles';
import { SoftShutdownService } from '../soft-shutdown/soft-shutdown.service';
import { PrismaHealthIndicator } from './prisma-health-indicator.service';
import { WhitelistPort } from '../port-whitelist';

@Controller('health')
@WhitelistPort(metricsPort)
export class HealthController {
  public constructor(
    private readonly health: HealthCheckService,
    private readonly db: PrismaHealthIndicator,
    private readonly softShutdown: SoftShutdownService,
  ) { }

  @Get()
  @HealthCheck()
  public check(): Promise<HealthCheckResult> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.health.check([
      () => this.db.isHealthy('database'),
      () => this.softShutdown.check(),
    ]);
  }
}
