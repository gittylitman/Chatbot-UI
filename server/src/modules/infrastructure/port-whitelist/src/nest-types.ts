import { Socket } from 'net';

interface HttpContext {
  getRequest(): {
    socket: Socket;
  };
}

export interface ExecutionContext {
  switchToHttp(): HttpContext;
  // eslint-disable-next-line @typescript-eslint/ban-types
  getClass(): Object;
}

export interface CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean>;
}

export interface NestApplication {
  useGlobalGuards(...guards: CanActivate[]): NestApplication;
}
