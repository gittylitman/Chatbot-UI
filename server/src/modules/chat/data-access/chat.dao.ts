import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Nullable } from '../../../utils/types-helper';
import { generateId } from '../../../utils/id';
import { ChatSession, ChatMessage, MessageVersion, MessageRole } from '@prisma/client';
import { ChatMessageNotFoundError } from '../chat.error';
import { FullChatSession } from '../service/chat.schema';

@Injectable()
export class ChatDao {
  constructor(private prismaService: PrismaService) { }

getSession(id: string): Promise<Nullable<FullChatSession>> {
  return this.prismaService.chatSession.findFirst({
    where: { id, deletedAt: null },
    include: {
      messages: {
        orderBy: { createdAt: 'asc' },
        include: {
          versions: true,
          branches: {
            include: {
              versions: true,
              branches: true,     // important for recursion
            }
          },
          choices: true,
          dataItems: true
        }
      }
    }
  }) as any;
}


  async createSession(userId: string): Promise<ChatSession> {
    return this.prismaService.chatSession.create({
      data: { id: generateId('session'), userId }
    });
  }

  async addUserMessage(sessionId: string, message: string): Promise<ChatMessage> {
    return this.prismaService.chatMessage.create({
      data: { id: generateId('message'), sessionId, role: MessageRole.user, content: message }
    });
  }

  async addAgentMessage(
    parentMessageId: string,
    content: string,
    type: 'message' | 'choices' | 'directive' | 'data' | 'error',
    options?: { choices?: { id: string; label: string }[]; data?: object[]; action?: 'ask' | 'end' }
  ): Promise<ChatMessage> {
    const parentMessage = await this.prismaService.chatMessage.findUnique({ where: { id: parentMessageId } });
    if (!parentMessage) throw new ChatMessageNotFoundError(parentMessageId);

    const { choices, data, action } = options || {};
    return this.prismaService.chatMessage.create({
      data: {
        sessionId: parentMessage.sessionId,
        role: MessageRole.agent,
        content,
        type,
        action,
        parentMessageId: parentMessage.id,
        choices: { create: choices?.map(c => ({ id: c.id, label: c.label })) },
        dataItems: { create: data?.map(d => ({ key: Object.keys(d)[0], value: Object.values(d)[0] })) }
      },
      include: { choices: true, dataItems: true }
    });
  }

  async getUserHistory(userId: string) {
    return this.prismaService.chatSession.findMany({
      where: { userId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          include: { choices: true, dataItems: true }
        }
      }
    });
  }

  async getMessage(messageId: string): Promise<ChatMessage | null> {
    return this.prismaService.chatMessage.findUnique({
      where: { id: messageId },
      include: { versions: true, branches: { include: { versions: true, branches: true } } }
    });
  }

  async branchMessage(messageId: string, newContent: string): Promise<ChatMessage & { versions: MessageVersion[] }> {
    const oldMessage = await this.prismaService.chatMessage.findUnique({
      where: { id: messageId },
      include: { versions: true }
    });
    if (!oldMessage) throw new ChatMessageNotFoundError(messageId);

    return this.prismaService.chatMessage.create({
      data: {
        sessionId: oldMessage.sessionId,
        role: oldMessage.role,
        content: newContent,
        parentMessageId: oldMessage.id,
        versions: { create: { oldContent: oldMessage.content } }
      },
      include: { versions: true }
    });
  }

  async softDeleteMessage(messageId: string): Promise<ChatMessage> {
    return this.prismaService.chatMessage.update({
      where: { id: messageId },
      data: { deletedAt: new Date() }
    });
  }

  async softDeleteSession(sessionId: string): Promise<ChatSession> {
    await this.prismaService.chatMessage.updateMany({
      where: { sessionId },
      data: { deletedAt: new Date() }
    });

    return this.prismaService.chatSession.update({
      where: { id: sessionId },
      data: { deletedAt: new Date() }
    });
  }

  async getFullSession(sessionId: string) {
  return this.prismaService.chatSession.findUnique({
    where: { id: sessionId },
    include: {
      messages: {
        where: { deletedAt: null },
        orderBy: { createdAt: 'asc' },
        include: {
          branches: {
            where: { deletedAt: null },
            include: {
              branches: true,
            }
          }
        }
      }
    }
  });
}

}
