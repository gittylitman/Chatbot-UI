import { PortHandle } from './port-handle';

export type PortWhitelistConfig = {
  /**
   * Which port will have access to all controllers that don't have `@WhitelistPort` decorators
   */
  defaultPort: PortHandle;

  /**
   * What to do when blocking a request to a route that doesn't match the whitelist
   * e.g. `onBlocked: () => { throw new NotFoundException(); }`
   */
  onBlocked(): void;
};
