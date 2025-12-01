import { Injectable, OnModuleInit, INestApplication, OnApplicationShutdown, INestMicroservice } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ServiceLogger } from '../../utils/logger/logger';

type PrismaConfig = {
  log: [
    {
      emit: 'event';
      level: 'query';
    },
    {
      emit: 'event';
      level: 'error';
    },
    {
      emit: 'event';
      level: 'info';
    },
    {
      emit: 'event';
      level: 'warn';
    },
  ];
};

const prismaConfig: PrismaConfig = {
  log: [
    {
      emit: 'event',
      level: 'query',
    },
    {
      emit: 'event',
      level: 'error',
    },
    {
      emit: 'event',
      level: 'info',
    },
    {
      emit: 'event',
      level: 'warn',
    },
  ],
};

@Injectable()
export class PrismaService extends PrismaClient<PrismaConfig> implements OnModuleInit, OnApplicationShutdown {
  constructor(private readonly logger: ServiceLogger) {
    super(prismaConfig);
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();

    this.$on('error', (event) => {
      this.logger.error('Error from prisma', {
        'event.action': 'PrismaError',
        'log.level': 'error',
        error: event
      });
    });
    this.$on('warn', (event) => {
      this.logger.warn('Warn from prisma', {
        'event.action': 'PrismaWarn',
        'log.level': 'warn',
        event
      });
    });
    this.$on('info', (event) => {
      this.logger.info('Info from prisma', {
        'event.action': 'PrismaInfo',
        'log.level': 'info',
        event
      });
    });

    this.$on('query', async (e) => {
      const { duration, query } = e;
      console.log('Database call', duration, { 'prisma.sql.query': query });
    });
  }

  // https://docs.nestjs.com/recipes/prisma#issues-with-enableshutdownhooks
  async enableShutdownHooks(app: INestApplication | INestMicroservice): Promise<void> {
    this.$on('beforeExit', async () => {
      this.logger.info('Going to shut down APP', {
        'event.action': 'AppInfo',
        'log.level': 'info',
      });
      await app.close();
    });
  }

  async onApplicationShutdown(): Promise<void> {
    this.logger.info('Going to disconnect DB', {
      'event.action': 'AppInfo',
      'log.level': 'info',
    });
    await this.$disconnect();
  }
}
