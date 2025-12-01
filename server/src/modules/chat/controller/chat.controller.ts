import { Controller, Post, Body, Get, Param, BadRequestException, Delete, Patch } from '@nestjs/common';
import { ChatService } from '../service/chat.service';
import { ServiceLogger } from '../../../utils/logger/logger';
import { CreateChatRequest, DirectiveAction, SendMessageResponse } from './chat.schema';
import { ChatSessionNotFoundError } from '../chat.error';
import { ChatSession } from '@prisma/client';
import { SendMessageParams, TreeNode } from '../service/chat.schema';

@Controller('/chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly logger: ServiceLogger,
  ) { }

  @Post('session/:userId')
  async createSession(@Param('userId') userId: string): Promise<ChatSession> {
    try {
      return await this.chatService.createSession(userId);
    } catch (error) {
      this.logger.error('Failed to create chat session', {
        'event.action': 'createSession',
        'log.level': 'error',
        error
      });
      throw error;
    }
  }

  @Post('session/:sessionId/message')
  async sendMessage(
    @Param('sessionId') sessionId: string,
    @Body() params: CreateChatRequest,
  ): Promise<SendMessageResponse> {
    try {
      const message = await this.chatService.handleUserMessage(sessionId, params);

      const agentResponse: SendMessageParams = {
        type: 'message',
        content: 'This is a stub response from the agent',
        action: DirectiveAction.end,
      };

      const response = await this.chatService.handleAgentResponse(message.id, agentResponse);

      return {
        ...agentResponse,
        responseId: response.id,
        id: message.id
      };
    } catch (error) {
      if (error instanceof ChatSessionNotFoundError) {
        throw new BadRequestException(error.message);
      }
      this.logger.error('Failed to handle chat message', {
        'event.action': 'sendMessage',
        'log.level': 'error',
        error
      });
      throw error;
    }
  }

  @Get('session/:sessionId')
  async getSession(@Param('sessionId') sessionId: string) {
    try {
      return await this.chatService.getSession(sessionId);
    } catch (error) {
      if (error instanceof ChatSessionNotFoundError) {
        throw new BadRequestException(error.message);
      }
      this.logger.error('Failed to fetch chat session', {
        'event.action': 'getSession',
        'log.level': 'error',
        error
      });
      throw error;
    }
  }

  @Get('user/:userId/history')
  async getUserHistory(@Param('userId') userId: string) {
    try {
      return await this.chatService.getUserHistory(userId);
    } catch (error) {
      this.logger.error('Failed to fetch user chat history', {
        'event.action': 'getUserHistory',
        'log.level': 'error',
        error
      });
      throw new BadRequestException('Failed to fetch user chat history');
    }
  }

  @Delete('session/:sessionId')
  async deleteSession(@Param('sessionId') sessionId: string) {
    try {
      return await this.chatService.softDeleteSession(sessionId);
    } catch (error) {
      throw new BadRequestException('Failed to delete chat session');
    }
  }

  @Patch('message/:messageId')
  async editMessage(
    @Param('messageId') messageId: string,
    @Body() body: { userId: string; content: string }
  ) {
    try {
      return await this.chatService.editMessage(body.userId, messageId, body.content);
    } catch (error) {
      this.logger.error('Failed to edit message', { error });
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('Unknown error');
    }
  }

  @Delete('message/:messageId')
  async deleteMessage(@Param('messageId') messageId: string) {
    return this.chatService.softDeleteMessage(messageId);
  }

  @Get('/session/:sessionId/visualize')
  async visualizeSession(@Param('sessionId') sessionId: string) : Promise<{ sessionId: string; visualization: string; tree: TreeNode[] }> {
  try {
    return await this.chatService.visualizeSession(sessionId);
  } catch (error) {
    this.logger.error('Failed to visualize session', { error });
    throw new BadRequestException('Failed to visualize session');
  }
}
}
