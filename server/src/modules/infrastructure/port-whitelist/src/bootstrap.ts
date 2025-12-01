import type { PortWhitelistConfig } from './config';
import type { NestApplication } from './nest-types';
import { PortWhitelistGuard } from './guard';

export function bootstrapPortWhitelists(app: NestApplication, config?: Partial<PortWhitelistConfig>): void {
  app.useGlobalGuards(new PortWhitelistGuard(config));
}
