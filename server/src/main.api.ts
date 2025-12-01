// import { install } from 'source-map-support';
// install();

// import { urlencoded, json } from 'express';
// import { LoggerService, ValidationPipe } from '@nestjs/common';
// import { HttpAdapterHost } from '@nestjs/core';
// import { AppModule } from './modules/app/app.module';
// import { PrismaService } from './modules/prisma/prisma.service';
// import { HttpExceptionFilter } from './utils/exceptionFilter';
// import { ServiceLogger } from './utils/logger/logger';
// import { ApplicationMode } from './modules/infrastructure/configuration/schema/application-mode.enum';
// import { bootstrap } from './modules/bootstrap/bootstrap-facade';
// import { createBootstrapEnv } from './modules/bootstrap/env-factory';
// import { registerSoftShutdown } from './modules/infrastructure/soft-shutdown/soft-shutdown-registration';

// async function bootstrapApi() {
//   const bootstrapped = await bootstrap(AppModule, {
//     APPLICATION_MODE: ApplicationMode.API,
//     ...createBootstrapEnv(),
//   });

//   const app = bootstrapped.app;
//   const logger = app.get(ServiceLogger);
//   const nestLogger: LoggerService = {
//     ...logger,
//     log: (message: string) => {
//       logger.info(message);
//     },
//     error: (message: string) => {
//       logger.error(message);
//     },
//     warn: (message: string) => {
//       logger.warn(message);
//     },
//   };

//   app.useLogger(nestLogger);
//   // https://docs.nestjs.com/recipes/prisma#issues-with-enableshutdownhooks
//   const prismaService: PrismaService = app.get(PrismaService);
//   await prismaService.enableShutdownHooks(app);

//   const { httpAdapter } = app.get(HttpAdapterHost);
//   const maxBodySize = '20mb';
//   app.useGlobalFilters(new HttpExceptionFilter(logger, httpAdapter));
//   app.useGlobalPipes(new ValidationPipe({ transform: true }));

//   if (bootstrapped.isHttpServer) {
//     registerSoftShutdown(bootstrapped.app);
//     bootstrapped.app.use(json({ limit: maxBodySize }));
//     bootstrapped.app.use(urlencoded({ extended: true, limit: maxBodySize }));
//   }

//   bootstrapped.app.enableCors({
//     origin: ['http://localhost:1100', 'http://127.0.0.1:1100'],
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     credentials: true,
//   });

//   await bootstrapped.start();
//   }

// // eslint-disable-next-line @typescript-eslint/no-floating-promises
// void bootstrapApi();


import { install } from 'source-map-support';
install();

import { urlencoded, json } from 'express';
import { LoggerService, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { PrismaService } from './modules/prisma/prisma.service';
import { HttpExceptionFilter } from './utils/exceptionFilter';
import { ServiceLogger } from './utils/logger/logger';
import { ApplicationMode } from './modules/infrastructure/configuration/schema/application-mode.enum';
import { bootstrap } from './modules/bootstrap/bootstrap-facade';
import { createBootstrapEnv } from './modules/bootstrap/env-factory';
import { registerSoftShutdown } from './modules/infrastructure/soft-shutdown/soft-shutdown-registration';

async function bootstrapApi() {
  const bootstrapped = await bootstrap(AppModule, {
    APPLICATION_MODE: ApplicationMode.API,
    ...createBootstrapEnv(),
  });

  const app = bootstrapped.app;
  const logger = app.get(ServiceLogger);
  const nestLogger: LoggerService = {
    ...logger,
    log: (message: string) => {
      logger.info(message);
    },
    error: (message: string) => {
      logger.error(message);
    },
    warn: (message: string) => {
      logger.warn(message);
    },
  };

  app.useLogger(nestLogger);
  // https://docs.nestjs.com/recipes/prisma#issues-with-enableshutdownhooks
  const prismaService: PrismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  const { httpAdapter } = app.get(HttpAdapterHost);
  const maxBodySize = '20mb';
  app.useGlobalFilters(new HttpExceptionFilter(logger, httpAdapter));
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  if (bootstrapped.isHttpServer) {
    registerSoftShutdown(bootstrapped.app);
    bootstrapped.app.use(json({ limit: maxBodySize }));
    bootstrapped.app.use(urlencoded({ extended: true, limit: maxBodySize }));
  }

  bootstrapped.app.enableCors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await bootstrapped.start();
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
void bootstrapApi();
