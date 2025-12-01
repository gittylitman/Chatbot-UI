import { Module } from '@nestjs/common';
import { PrismaModule } from '@app/prisma/prisma.module';
import { ChatDao } from './chat.dao';

@Module({
  imports: [PrismaModule],
  providers: [ChatDao],
  exports: [ChatDao],
})
export class ChatDaoModule { }
