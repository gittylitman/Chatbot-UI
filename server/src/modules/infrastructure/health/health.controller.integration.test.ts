import { INestApplication, Injectable } from '@nestjs/common';
import { HealthCheckError, TerminusModule } from '@nestjs/terminus';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { PrismaHealthIndicator } from './prisma-health-indicator.service';
import { HealthController } from './health.controller';
import { HealthModule } from './health.module';
import { SoftShutdownService } from '../soft-shutdown/soft-shutdown.service';


@Injectable()
class MockPrismaHealthIndicator {
  isHealthy() {
    throw new HealthCheckError('Prisma health check failed', new Error('Test'));
  }
}

@Injectable()
class MockSoftShutdownIndicator {
  check() {
    throw new HealthCheckError('Soft shutdown failed', new Error('Test'));
  }
}

describe('HealthController', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const testModule = await Test.createTestingModule({
      imports: [HealthModule],
    }).compile();
    app = testModule.createNestApplication();
    await app.init();
  });

  it("Creates 'GET /health' endpoint", async () => {
    const response = await request(app.getHttpServer()).get('/health').send();
    expect(response.status).toEqual(200);
  });

  it('Responds with database status', async () => {
    const response = await request(app.getHttpServer()).get('/health').send();
    expect(response.body.info && response.body.info.database).toEqual({ status: 'up' });
  });

  it("Reports if database isn't healthy", async () => {
    const testModule = await Test.createTestingModule({
      imports: [TerminusModule],
      providers: [
        { provide: PrismaHealthIndicator, useClass: MockPrismaHealthIndicator },
        { provide: SoftShutdownService, useClass: MockSoftShutdownIndicator },
      ],
      controllers: [HealthController],
    }).compile();
    const app = testModule.createNestApplication();
    await app.init();
    const response = await request(app.getHttpServer()).get('/health').send();
    expect(response.status).toEqual(503);
    expect(response.body.info).toEqual({});
    expect(response.body.details).toEqual({});
  });

  it("Reports if redis isn't healthy", async () => {
    const testModule = await Test.createTestingModule({
      imports: [TerminusModule],
      providers: [
        { provide: PrismaHealthIndicator, useClass: MockPrismaHealthIndicator },
        { provide: SoftShutdownService, useClass: MockSoftShutdownIndicator },
      ],
      controllers: [HealthController],
    }).compile();
    const app = testModule.createNestApplication();
    await app.init();
    const response = await request(app.getHttpServer()).get('/health').send();
    expect(response.status).toEqual(503);
    expect(response.body.info).toEqual({});
    expect(response.body.details).toEqual({});
  });
});
