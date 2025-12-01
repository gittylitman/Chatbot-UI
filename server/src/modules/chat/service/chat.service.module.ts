import { Module } from '@nestjs/common';
import { ChatDaoModule } from '../data-access/chat.dao.module';
import { ChatService } from './chat.service';

@Module({
  imports: [ChatDaoModule],
  providers: [ChatService],
  exports: [ChatService],
})
export class ChatServiceModule { }
