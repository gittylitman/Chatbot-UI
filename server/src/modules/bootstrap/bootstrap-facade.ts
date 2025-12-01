import { INestApplication } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ApplicationMode } from '../infrastructure/configuration/schema/application-mode.enum';
import { ConfigurationSchema } from '../infrastructure/configuration/schema/configuration.schema';
import { applicativePort as applicativePortHandle, metricsPort as metricsPortHandle } from './port-handles';
import { HttpServerBootstrapper } from './bootstrap-http-server';
import { bootstrapMicroservice } from './bootstrap-microservice';

type NestJSModule = unknown;

type HttpServerApplication = {
  isHttpServer: true;
  app: NestExpressApplication;
  start: () => Promise<void>;
};

type MicroserviceApplication = {
  isHttpServer: false;
  app: INestApplication;
  start: () => Promise<void>;
};

export async function bootstrap(
  module: NestJSModule,
  env: Pick<ConfigurationSchema, 'APPLICATION_MODE' | 'DISABLE_METRICS' | 'METRICS_PORT'>,
): Promise<HttpServerApplication | MicroserviceApplication> {
  const isApi = env.APPLICATION_MODE === ApplicationMode.API;
  const metricsDisabled = env.DISABLE_METRICS;
  const useHttpServer = isApi || !metricsDisabled;

  if (useHttpServer) {
    const apiDefaultPort = 3009;
    const defaultPort = isApi ? apiDefaultPort : 0;
    const bootstrapper = new HttpServerBootstrapper(module, {
      ports: [
        {
          number: env.METRICS_PORT as number,
          handle: metricsPortHandle,
          disabled: metricsDisabled,
        },
        ...(isApi
          ? [
              {
                number: defaultPort,
                handle: applicativePortHandle,
              },
            ]
          : []),
      ],
      defaultPort: applicativePortHandle,
      usePortWhitelist: isApi,
    });
    const [app, start] = await bootstrapper.bootstrap();
    return {
      app,
      start,
      isHttpServer: true,
    };
  }
  const [app, start] = await bootstrapMicroservice(module);
  return {
    app,
    start,
    isHttpServer: false,
  };
}
