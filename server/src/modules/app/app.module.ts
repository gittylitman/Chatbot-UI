import { Module } from '@nestjs/common';
import { LoggerModule } from '../../utils/logger/logger.module';
import { HealthModule } from '../infrastructure/health/health.module';
import { AppController } from './app.controller';
import { ChatControllerModule } from '@app/chat/controller/chat.controller.module';

@Module({
  imports: [LoggerModule, HealthModule, ChatControllerModule],
  controllers: [AppController],
})
export class AppModule { }
