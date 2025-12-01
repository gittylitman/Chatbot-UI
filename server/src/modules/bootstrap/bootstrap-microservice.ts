import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

type NestJSModule = unknown;

export async function bootstrapMicroservice(module: NestJSModule): Promise<[INestApplication, () => Promise<void>]> {
  const app = await NestFactory.create(module);
  return [
    app,
    async () => {
      await app.init();
    },
  ];
}
