import { TestBed } from '@automock/jest';
import { SoftShutdownService } from './soft-shutdown.service';
import { HealthCheckError } from '@nestjs/terminus';

describe('Soft shutdown service unit tests', () => {
  describe('When first started', () => {
    it('Should return healthy check', async () => {
      const { unit: softShutdown } = TestBed.create(SoftShutdownService).compile();
      await expect(softShutdown.check()).resolves.toMatchObject({
        softShutdown: { status: 'up' },
      });
    });
  });

  describe('When called shutdown', () => {
    it("Shouldn't throw", () => {
      const { unit: softShutdown } = TestBed.create(SoftShutdownService).compile();
      expect(() => softShutdown.shutdown()).not.toThrow();
    });
  });

  describe('After called shutdown', () => {
    it('Should return unhealthy check', async () => {
      const { unit: softShutdown } = TestBed.create(SoftShutdownService).compile();
      softShutdown.shutdown();
      try {
        await softShutdown.check();
      } catch (error) {
        expect(error).toBeInstanceOf(HealthCheckError);
        if (!(error instanceof HealthCheckError)) {
          return;
        }
        expect(error.message).toBe('Soft shut down');
        expect(error.causes).toMatchObject({
          softShutdown: { status: 'down' },
        });
        return;
      }
      throw new Error('Should have thrown');
    });
  });
});
