import { PortHandle } from './port-handle';
import { PORT_WHITELIST_PORT_HANDLE } from './symbols';

/**
 * Class decorator intended to decorate `@Controller`s.
 * Its methods will be accessible from the port in the given handle.
 * If the port is different, the methods won't be accessible (return 404).
 */
// A mixin class must have a constructor with a single rest parameter of type 'any[]'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Constructor = { new (...args: any[]): Record<never, never> };
export function WhitelistPort(portHandle: PortHandle) {
  return function <T extends Constructor>(constructor: T): T {
    return class extends constructor {
      // A mixin class must have a constructor with a single rest parameter of type 'any[]'
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      public constructor(...args: any[]) {
        super(...args);
        Reflect.defineMetadata(PORT_WHITELIST_PORT_HANDLE, portHandle, constructor);
      }
    };
  };
}
