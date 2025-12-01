import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { PrismaModule } from '../../prisma/prisma.module';
import { PrismaHealthIndicator } from './prisma-health-indicator.service';
import { HealthController } from './health.controller';
import { SoftShutdownModule } from '../soft-shutdown/soft-shutdown.module';

@Module({
  imports: [TerminusModule, PrismaModule, SoftShutdownModule],
  providers: [PrismaHealthIndicator],
  controllers: [HealthController],
})
export class HealthModule { }
