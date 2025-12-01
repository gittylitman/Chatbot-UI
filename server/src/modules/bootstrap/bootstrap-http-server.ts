import http from 'http';
import express, { Express } from 'express';
import { NotFoundException } from '@nestjs/common';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { PortHandle, bootstrapPortWhitelists } from '../infrastructure/port-whitelist';

export type HttpServerConfiguration = {
  ports: {
    number: number;
    handle: PortHandle;
    disabled?: boolean;
  }[];
  defaultPort?: PortHandle;
  usePortWhitelist?: boolean;
};

type NestJSModule = unknown;

export class HttpServerBootstrapper {
  private server: Express | null = null;

  constructor(
    private readonly module: NestJSModule,
    private readonly config: HttpServerConfiguration,
    private readonly httpServerFactory: { createServer: typeof http.createServer } = http,
  ) { }

  async bootstrap(): Promise<[NestExpressApplication, () => Promise<void>]> {
    this.server = express();
    const api = await this.createNestApplication();
    this.bootstrapPortWhitelistIfNeeded(api);
    return [
      api,
      async () => {
        await api.init();
        this.listenToPorts();
      },
    ];
  }

  private createNestApplication(): Promise<NestExpressApplication> {
    return NestFactory.create<NestExpressApplication>(this.module, new ExpressAdapter(this.server));
  }

  private bootstrapPortWhitelistIfNeeded(api: NestExpressApplication): void {
    if (this.config.usePortWhitelist) {
      bootstrapPortWhitelists(api, {
        defaultPort: this.config.defaultPort,
        onBlocked: () => {
          throw new NotFoundException();
        },
      });
    }
  }

  private listenToPorts() {
    if (!this.server) {
      throw new Error("Bootstrap HTTP wasn't called before start");
    }
    const server = this.server;
    this.config.ports.forEach((port) => {
      if (!port.disabled) {
        this.httpServerFactory.createServer(server).listen(port.number, '0.0.0.0');
      }
      if (this.config.usePortWhitelist) {
        port.handle.bindPort(port.number);
      }
    });
  }
}
