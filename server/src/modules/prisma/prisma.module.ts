import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { LoggerModule } from '../../utils/logger/logger.module';

@Module({ imports: [LoggerModule], providers: [PrismaService], exports: [PrismaService] })
export class PrismaModule {}
