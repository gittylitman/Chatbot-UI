import http from 'http';
import express from 'express';
import { Express } from 'express';
import axios, { AxiosPromise } from 'axios';
import { Controller, Get, INestApplication, Module, NotFoundException } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { PortHandle } from './port-handle';
import { PortWhitelistConfig } from './config';
import { bootstrapPortWhitelists, WhitelistPort } from '.';
import { AddressInfo } from 'net';

type Port = number;

class HttpServerFactory {
  private pool: http.Server[] = [];

  public create(expressServer: Express): http.Server {
    const server = http.createServer(expressServer);
    this.pool.push(server);
    return server; // eslint-disable-line @typescript-eslint/no-unsafe-return
  }

  public async destroyAll(): Promise<void> {
    const toDestroy = [...this.pool];
    this.pool.splice(0, this.pool.length);
    await Promise.all(
      toDestroy.map((server) => {
        return new Promise((resolve, reject) => {
          server.close((error) => {
            if (error) {
              reject(error);
              return;
            }
            resolve(null);
          });
        });
      }),
    );
  }
}

describe('Port whitelist unit tests', () => {
  describe('When a Nest application is running on 2 different ports', () => {
    describe("When port whitelist isn't given configuration", () => {
      describe('When no class is decorated with port whitelist', () => {
        @Controller()
        class Controller1 {
          // eslint-disable-next-line class-methods-use-this
          @Get() public get(): string {
            return 'success';
          }
        }

        @Module({ controllers: [Controller1] })
        class Module1 {}

        let app: INestApplication;
        let port1: Port;
        let port2: Port;
        const httpServerFactory = new HttpServerFactory();

        beforeAll(async () => {
          [app, port1, port2] = await createNestApplicationOnTwoPorts(Module1, httpServerFactory);
        });

        afterAll(async () => {
          await app.close();
          await httpServerFactory.destroyAll();
        });

        it('Should succeed regardless of port', async () => {
          const [response1, response2] = await Promise.all([httpCall(port1, 'GET', ''), httpCall(port2, 'GET', '')]);
          expect(response1.status).toBe(200);
          expect(response2.status).toBe(200);
        });
      });

      describe("When one class has whitelist, and the other doesn't", () => {
        const otherPortHandle = new PortHandle();
        const whitelistPortHandle = new PortHandle();

        @Controller('/unwhitelisted')
        class Controller1 {
          // eslint-disable-next-line class-methods-use-this
          @Get() public get(): string {
            return 'success';
          }
        }

        @Controller('/whitelisted')
        @WhitelistPort(whitelistPortHandle)
        class Controller2 {
          // eslint-disable-next-line class-methods-use-this
          @Get() public get(): string {
            return 'success';
          }
        }

        @Module({ controllers: [Controller1, Controller2] })
        class Module1 {}

        let app: INestApplication;
        let otherPort: Port;
        let whitelistPort: Port;
        const httpServerFactory = new HttpServerFactory();

        beforeAll(async () => {
          [app, otherPort, whitelistPort] = await createNestApplicationOnTwoPorts(Module1, httpServerFactory);
          otherPortHandle.bindPort(otherPort);
          whitelistPortHandle.bindPort(whitelistPort);
        });

        afterAll(async () => {
          await app.close();
          await httpServerFactory.destroyAll();
        });

        it('Should successfully get unwhitelisted route on unwhitelisted port', async () => {
          const response = await httpCall(otherPort, 'GET', 'unwhitelisted');
          expect(response.status).toBe(200);
        });

        it('Should fail getting whitelisted route on unwhitelisted port', async () => {
          const response = await httpCall(otherPort, 'GET', 'whitelisted');
          expect(response.status).toBe(403);
        });

        it('Should successfully get whitelisted route on whitelisted port', async () => {
          const response = await httpCall(whitelistPort, 'GET', 'whitelisted');
          expect(response.status).toBe(200);
        });

        it('Should successfully get unwhitelisted route on whitelisted port', async () => {
          const response = await httpCall(whitelistPort, 'GET', 'unwhitelisted');
          expect(response.status).toBe(200);
        });
      });

      describe('When two classes both have different whitelists', () => {
        const port1Handle = new PortHandle();
        const port2Handle = new PortHandle();

        @Controller('/1')
        @WhitelistPort(port1Handle)
        class Controller1 {
          // eslint-disable-next-line class-methods-use-this
          @Get() public get(): string {
            return 'success';
          }
        }

        @Controller('/2')
        @WhitelistPort(port2Handle)
        class Controller2 {
          // eslint-disable-next-line class-methods-use-this
          @Get() public get(): string {
            return 'success';
          }
        }

        @Module({ controllers: [Controller1, Controller2] })
        class Module1 {}

        let app: INestApplication;
        let port1: Port;
        let port2: Port;
        const httpServerFactory = new HttpServerFactory();

        beforeAll(async () => {
          [app, port1, port2] = await createNestApplicationOnTwoPorts(Module1, httpServerFactory);
          port1Handle.bindPort(port1);
          port2Handle.bindPort(port2);
        });

        afterAll(async () => {
          await app.close();
          await httpServerFactory.destroyAll();
        });

        it('Should successfully get route 1 on port 1', async () => {
          const response = await httpCall(port1, 'GET', '1');
          expect(response.status).toBe(200);
        });

        it('Should fail getting route 2 on port 1', async () => {
          const response = await httpCall(port1, 'GET', '2');
          expect(response.status).toBe(403);
        });

        it('Should successfully route 2 on port 2', async () => {
          const response = await httpCall(port2, 'GET', '2');
          expect(response.status).toBe(200);
        });

        it('Should fail getting route 1 on port 2', async () => {
          const response = await httpCall(port2, 'GET', '1');
          expect(response.status).toBe(403);
        });
      });
    });

    describe('When port whitelist has onBlock throwing NotFoundException', () => {
      describe('When no class is decorated with port whitelist', () => {
        @Controller()
        class Controller1 {
          // eslint-disable-next-line class-methods-use-this
          @Get() public get(): string {
            return 'success';
          }
        }

        @Module({ controllers: [Controller1] })
        class Module1 {}

        let app: INestApplication;
        let port1: Port;
        let port2: Port;
        const httpServerFactory = new HttpServerFactory();

        beforeAll(async () => {
          [app, port1, port2] = await createNestApplicationOnTwoPorts(Module1, httpServerFactory, {
            onBlocked: () => {
              throw new NotFoundException();
            },
          });
        });

        afterAll(async () => {
          await app.close();
          await httpServerFactory.destroyAll();
        });

        it('Should succeed regardless of port', async () => {
          const [response1, response2] = await Promise.all([httpCall(port1, 'GET', ''), httpCall(port2, 'GET', '')]);
          expect(response1.status).toBe(200);
          expect(response2.status).toBe(200);
        });
      });

      describe("When one class has whitelist, and the other doesn't", () => {
        const otherPortHandle = new PortHandle();
        const whitelistPortHandle = new PortHandle();

        @Controller('/unwhitelisted')
        class Controller1 {
          // eslint-disable-next-line class-methods-use-this
          @Get() public get(): string {
            return 'success';
          }
        }

        @Controller('/whitelisted')
        @WhitelistPort(whitelistPortHandle)
        class Controller2 {
          // eslint-disable-next-line class-methods-use-this
          @Get() public get(): string {
            return 'success';
          }
        }

        @Module({ controllers: [Controller1, Controller2] })
        class Module1 {}

        let app: INestApplication;
        let otherPort: Port;
        let whitelistPort: Port;
        const httpServerFactory = new HttpServerFactory();

        beforeAll(async () => {
          [app, otherPort, whitelistPort] = await createNestApplicationOnTwoPorts(Module1, httpServerFactory, {
            onBlocked: () => {
              throw new NotFoundException();
            },
          });
          otherPortHandle.bindPort(otherPort);
          whitelistPortHandle.bindPort(whitelistPort);
        });

        afterAll(async () => {
          await app.close();
          await httpServerFactory.destroyAll();
        });

        it('Should successfully get unwhitelisted route on unwhitelisted port', async () => {
          const response = await httpCall(otherPort, 'GET', 'unwhitelisted');
          expect(response.status).toBe(200);
        });

        it('Should fail getting whitelisted route on unwhitelisted port', async () => {
          const response = await httpCall(otherPort, 'GET', 'whitelisted');
          expect(response.status).toBe(404);
        });

        it('Should successfully get whitelisted route on whitelisted port', async () => {
          const response = await httpCall(whitelistPort, 'GET', 'whitelisted');
          expect(response.status).toBe(200);
        });

        it('Should successfully get unwhitelisted route on whitelisted port', async () => {
          const response = await httpCall(whitelistPort, 'GET', 'unwhitelisted');
          expect(response.status).toBe(200);
        });
      });

      describe('When two classes both have different whitelists', () => {
        const port1Handle = new PortHandle();
        const port2Handle = new PortHandle();

        @Controller('/1')
        @WhitelistPort(port1Handle)
        class Controller1 {
          // eslint-disable-next-line class-methods-use-this
          @Get() public get(): string {
            return 'success';
          }
        }

        @Controller('/2')
        @WhitelistPort(port2Handle)
        class Controller2 {
          // eslint-disable-next-line class-methods-use-this
          @Get() public get(): string {
            return 'success';
          }
        }

        @Module({ controllers: [Controller1, Controller2] })
        class Module1 {}

        let app: INestApplication;
        let port1: Port;
        let port2: Port;
        const httpServerFactory = new HttpServerFactory();

        beforeAll(async () => {
          [app, port1, port2] = await createNestApplicationOnTwoPorts(Module1, httpServerFactory, {
            onBlocked: () => {
              throw new NotFoundException();
            },
          });
          port1Handle.bindPort(port1);
          port2Handle.bindPort(port2);
        });

        afterAll(async () => {
          await app.close();
          await httpServerFactory.destroyAll();
        });

        it('Should successfully get route 1 on port 1', async () => {
          const response = await httpCall(port1, 'GET', '1');
          expect(response.status).toBe(200);
        });

        it('Should fail getting route 2 on port 1', async () => {
          const response = await httpCall(port1, 'GET', '2');
          expect(response.status).toBe(404);
        });

        it('Should successfully route 2 on port 2', async () => {
          const response = await httpCall(port2, 'GET', '2');
          expect(response.status).toBe(200);
        });

        it('Should fail getting route 1 on port 2', async () => {
          const response = await httpCall(port2, 'GET', '1');
          expect(response.status).toBe(404);
        });
      });
    });

    describe('When port whitelist configuration has defaultPort', () => {
      describe('When no class has port whitelist', () => {
        @Controller()
        class Controller1 {
          // eslint-disable-next-line class-methods-use-this
          @Get() public get(): string {
            return 'success';
          }
        }

        @Module({ controllers: [Controller1] })
        class Module1 {}

        let app: INestApplication;
        let defaultPort: Port;
        let port2: Port;
        const httpServerFactory = new HttpServerFactory();

        beforeAll(async () => {
          const portHandle = new PortHandle();
          [app, defaultPort, port2] = await createNestApplicationOnTwoPorts(Module1, httpServerFactory, {
            defaultPort: portHandle,
            onBlocked: () => {
              throw new NotFoundException();
            },
          });
          portHandle.bindPort(defaultPort);
        });

        afterAll(async () => {
          await app.close();
          await httpServerFactory.destroyAll();
        });

        it('Should succeed on default port', async () => {
          const response = await httpCall(defaultPort, 'GET', '');
          expect(response.status).toBe(200);
        });

        it('Should fail on other port', async () => {
          const response = await httpCall(port2, 'GET', '');
          expect(response.status).toBe(404);
        });
      });

      describe("When one class has whitelist, and the other doesn't", () => {
        describe('When defaultPort is the unwhitelisted', () => {
          const unwhitelistedPortHandle = new PortHandle();
          const whitelistPortHandle = new PortHandle();
          const defaultPortHandle = unwhitelistedPortHandle;

          @Controller('/unwhitelisted')
          class UndecoratedController {
            // eslint-disable-next-line class-methods-use-this
            @Get() public get(): string {
              return 'success';
            }
          }

          @Controller('/whitelisted')
          @WhitelistPort(whitelistPortHandle)
          class DecoratedController {
            // eslint-disable-next-line class-methods-use-this
            @Get() public get(): string {
              return 'success';
            }
          }

          @Module({ controllers: [UndecoratedController, DecoratedController] })
          class Module1 {}

          let app: INestApplication;
          let undecoratedPort: Port;
          let decoratedPort: Port;
          const httpServerFactory = new HttpServerFactory();

          beforeAll(async () => {
            [app, undecoratedPort, decoratedPort] = await createNestApplicationOnTwoPorts(Module1, httpServerFactory, {
              defaultPort: defaultPortHandle,
              onBlocked: () => {
                throw new NotFoundException();
              },
            });
            unwhitelistedPortHandle.bindPort(undecoratedPort);
            whitelistPortHandle.bindPort(decoratedPort);
          });

          afterAll(async () => {
            await app.close();
            await httpServerFactory.destroyAll();
          });

          it('Should successfully get unwhitelisted route on unwhitelisted=default port', async () => {
            const response = await httpCall(undecoratedPort, 'GET', 'unwhitelisted');
            expect(response.status).toBe(200);
          });

          it('Should fail getting whitelisted route on unwhitelisted=default port', async () => {
            const response = await httpCall(undecoratedPort, 'GET', 'whitelisted');
            expect(response.status).toBe(404);
          });

          it('Should successfully get whitelisted route on whitelisted port', async () => {
            const response = await httpCall(decoratedPort, 'GET', 'whitelisted');
            expect(response.status).toBe(200);
          });

          it('Should fail getting unwhitelisted route on whitelisted port', async () => {
            const response = await httpCall(decoratedPort, 'GET', 'unwhitelisted');
            expect(response.status).toBe(404);
          });
        });

        describe('When defaultPort is the whitelisted', () => {
          const unwhitelistedPortHandle = new PortHandle();
          const whitelistedPortHandle = new PortHandle();
          const defaultPortHandle = whitelistedPortHandle;

          @Controller('/unwhitelisted')
          class UndecoratedController {
            // eslint-disable-next-line class-methods-use-this
            @Get() public get(): string {
              return 'success';
            }
          }

          @Controller('/whitelisted')
          @WhitelistPort(whitelistedPortHandle)
          class DecoratedController {
            // eslint-disable-next-line class-methods-use-this
            @Get() public get(): string {
              return 'success';
            }
          }

          @Module({ controllers: [UndecoratedController, DecoratedController] })
          class Module1 {}

          let app: INestApplication;
          let unwhitelistedPort: Port;
          let whitelistedPort: Port;
          const httpServerFactory = new HttpServerFactory();

          beforeAll(async () => {
            [app, unwhitelistedPort, whitelistedPort] = await createNestApplicationOnTwoPorts(
              Module1,
              httpServerFactory,
              {
                defaultPort: defaultPortHandle,
                onBlocked: () => {
                  throw new NotFoundException();
                },
              },
            );
            unwhitelistedPortHandle.bindPort(unwhitelistedPort);
            whitelistedPortHandle.bindPort(whitelistedPort);
          });

          afterAll(async () => {
            await app.close();
            await httpServerFactory.destroyAll();
          });

          it('Should fail getting unwhitelisted route on unwhitelisted port', async () => {
            const response = await httpCall(unwhitelistedPort, 'GET', 'unwhitelisted');
            expect(response.status).toBe(404);
          });

          it('Should fail getting whitelisted route on unwhitelisted port', async () => {
            const response = await httpCall(unwhitelistedPort, 'GET', 'whitelisted');
            expect(response.status).toBe(404);
          });

          it('Should successfully get whitelisted route on whitelisted=default port', async () => {
            const response = await httpCall(whitelistedPort, 'GET', 'whitelisted');
            expect(response.status).toBe(200);
          });

          it('Should successfully get unwhitelisted route on whitelisted=default port', async () => {
            const response = await httpCall(whitelistedPort, 'GET', 'unwhitelisted');
            expect(response.status).toBe(200);
          });
        });
      });

      describe('When two classes are both decorated', () => {
        const port1Handle = new PortHandle();
        const port2Handle = new PortHandle();
        const defaultPortHandle = port1Handle;

        @Controller('/1')
        @WhitelistPort(port1Handle)
        class Controller1 {
          // eslint-disable-next-line class-methods-use-this
          @Get() public get(): string {
            return 'success';
          }
        }

        @Controller('/2')
        @WhitelistPort(port2Handle)
        class Controller2 {
          // eslint-disable-next-line class-methods-use-this
          @Get() public get(): string {
            return 'success';
          }
        }

        @Module({ controllers: [Controller1, Controller2] })
        class Module1 {}

        let app: INestApplication;
        let port1: Port;
        let port2: Port;
        const httpServerFactory = new HttpServerFactory();

        beforeAll(async () => {
          [app, port1, port2] = await createNestApplicationOnTwoPorts(Module1, httpServerFactory, {
            defaultPort: defaultPortHandle,
            onBlocked: () => {
              throw new NotFoundException();
            },
          });
          port1Handle.bindPort(port1);
          port2Handle.bindPort(port2);
        });

        afterAll(async () => {
          await app.close();
          await httpServerFactory.destroyAll();
        });

        it('Should successfully get route 1 on port 1', async () => {
          const response = await httpCall(port1, 'GET', '1');
          expect(response.status).toBe(200);
        });

        it('Should fail getting route 2 on port 1', async () => {
          const response = await httpCall(port1, 'GET', '2');
          expect(response.status).toBe(404);
        });

        it('Should successfully route 2 on port 2', async () => {
          const response = await httpCall(port2, 'GET', '2');
          expect(response.status).toBe(200);
        });

        it('Should fail getting route 1 on port 2', async () => {
          const response = await httpCall(port2, 'GET', '1');
          expect(response.status).toBe(404);
        });
      });
    });
  });
});

async function createNestApplicationOnTwoPorts(
  module: unknown,
  httpServerFactory: HttpServerFactory,
  multiportConfig?: Partial<PortWhitelistConfig>,
): Promise<[INestApplication, Port, Port]> {
  const expressServer = express();
  const app = await NestFactory.create(module, new ExpressAdapter(expressServer));
  bootstrapPortWhitelists(app, multiportConfig);
  await app.init();
  const [port1, port2] = await Promise.all([
    startServerAndGetPort(expressServer, httpServerFactory),
    startServerAndGetPort(expressServer, httpServerFactory),
  ]);
  return [app, port1, port2];
}

function startServerAndGetPort(expressServer: Express, httpServerFactory: HttpServerFactory): Promise<Port> {
  return new Promise((resolve, reject) => {
    const arbitraryUnusedPort = 0;
    const newServer = httpServerFactory.create(expressServer).listen(arbitraryUnusedPort);
    newServer.on('listening', () => {
      resolve((newServer.address() as AddressInfo).port);
    });
    newServer.on('error', (error) => reject(error));
  });
}

function httpCall(port: number, method: 'GET', url: string): AxiosPromise {
  return axios({
    baseURL: 'http://localhost:' + port,
    method,
    url,
    validateStatus: () => true,
  });
}
