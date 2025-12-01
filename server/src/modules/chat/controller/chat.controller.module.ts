import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatServiceModule } from '../service/chat.service.module';
import { LoggerModule } from '../../../utils/logger/logger.module';

@Module({
  imports: [ChatServiceModule, LoggerModule],
  controllers: [ChatController],
})
export class ChatControllerModule { }
