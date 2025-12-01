import { Module } from '@nestjs/common';
import { SoftShutdownService } from './soft-shutdown.service';

@Module({
  providers: [SoftShutdownService],
  exports: [SoftShutdownService],
})
export class SoftShutdownModule {}
