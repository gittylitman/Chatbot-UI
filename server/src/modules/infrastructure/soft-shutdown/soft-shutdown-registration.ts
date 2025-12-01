import { INestApplication } from '@nestjs/common';
import { SoftShutdownService } from './soft-shutdown.service';

export function registerSoftShutdown(app: INestApplication): void {
  const softShutdown = app.get(SoftShutdownService);
  // We use `process.on` instead of Nest's lifecycle hooks, because
  // we explicitly don't want Nest to start its shutdown procedure
  process.on('SIGHUP', () => {
    softShutdown.shutdown();
  });
}
