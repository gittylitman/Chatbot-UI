import { AddressInfo } from 'net';
import { PORT_WHITELIST_PORT_HANDLE } from './symbols';
import { PortHandle } from './port-handle';
import type { PortWhitelistConfig } from './config';
import type { CanActivate, ExecutionContext } from './nest-types';

export class PortWhitelistGuard implements CanActivate {
  public constructor(private readonly config?: Partial<PortWhitelistConfig>) {}

  public canActivate(context: ExecutionContext): boolean {
    if (this.hasWhitelist(context)) {
      if (this.portIsWhitelisted(context)) {
        return true;
      } else {
        if (this.config?.onBlocked) {
          this.config?.onBlocked();
        }
        return false;
      }
    }
    if (this.hasDefualtPort()) {
      if (this.portIsDefault(context)) {
        return true;
      } else {
        if (this.config?.onBlocked) {
          this.config?.onBlocked();
        }
        return false;
      }
    }
    return true;
  }

  // eslint-disable-next-line class-methods-use-this
  private getContextPort(context: ExecutionContext): number {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();
    const socket = request.socket;
    const address = socket.address() as AddressInfo;
    return address.port;
  }

  private hasDefualtPort(): boolean {
    return this.config?.defaultPort !== undefined;
  }

  private hasWhitelist(context: ExecutionContext): boolean {
    return this.getWhitelistedPort(context) !== undefined;
  }

  private portIsWhitelisted(context: ExecutionContext): boolean {
    const port = this.getContextPort(context);
    const whitelistedPort = this.getWhitelistedPort(context);
    return port === whitelistedPort;
  }

  private portIsDefault(context: ExecutionContext): boolean {
    const port = this.getContextPort(context);
    const defaultPort = this.config?.defaultPort?.port;
    return port === defaultPort;
  }

  // eslint-disable-next-line class-methods-use-this
  private getWhitelistedPort(context: ExecutionContext): number | undefined {
    const contextClass = context.getClass();
    const hasMetadata = Reflect.hasMetadata(PORT_WHITELIST_PORT_HANDLE, contextClass);
    if (!hasMetadata) {
      return undefined;
    }
    const metadata: PortHandle = Reflect.getMetadata(PORT_WHITELIST_PORT_HANDLE, contextClass);
    return metadata?.port;
  }
}
