import { BadRequestException, Injectable } from '@nestjs/common';
import { ChatDao } from '../data-access/chat.dao';
import { Choice, CreateChatRequest } from '../controller/chat.schema';
import { ChatSession, ChatMessage, MessageRole, DataItem, MessageVersion } from '@prisma/client';
import { ChatMessageNotFoundError, ChatSessionNotFoundError } from '../chat.error';
import { SendMessageParams, TreeNode } from './chat.schema';

@Injectable()
export class ChatService {
  constructor(private chatDao: ChatDao) { }

  async getSession(sessionId: string): Promise<ChatSession> {
    const session = await this.chatDao.getSession(sessionId);
    if (!session) throw new ChatSessionNotFoundError(sessionId);
    return session;
  }

  async createSession(userId: string): Promise<ChatSession> {
    return this.chatDao.createSession(userId);
  }

  async handleUserMessage(sessionId: string, request: CreateChatRequest): Promise<ChatMessage> {
    return this.chatDao.addUserMessage(sessionId, request.message);
  }

  async handleAgentResponse(parentMessageId: string, response: SendMessageParams): Promise<ChatMessage> {
    return this.chatDao.addAgentMessage(parentMessageId, response.content, response.type, {
      choices: response.choices,
      data: response.data,
      action: response.action,
    });
  }

  async getUserHistory(userId: string): Promise<ChatSession[]> {
    const chatHistory = await this.chatDao.getUserHistory(userId);
    if (chatHistory.length === 0) throw new ChatSessionNotFoundError(`No chat sessions found for user ${userId}`);
    return chatHistory;
  }

  async softDeleteSession(sessionId: string): Promise<ChatSession> {
    return this.chatDao.softDeleteSession(sessionId);
  }

  async softDeleteMessage(messageId: string): Promise<ChatMessage> {
    return this.chatDao.softDeleteMessage(messageId);
  }

  async editMessage(userId: string, messageId: string, newContent: string) {
    const message = await this.chatDao.getMessage(messageId);
    if (!message) throw new ChatMessageNotFoundError(messageId);

    if (message.role !== MessageRole.user)
      throw new BadRequestException('Only user messages can be edited.');

    const session = await this.chatDao.getSession(message.sessionId);
    if (session?.userId !== userId)
      throw new BadRequestException('You are not allowed to edit this message.');

    const branchedMessage = await this.chatDao.branchMessage(messageId, newContent);

    return {
      id: branchedMessage.id,
      content: branchedMessage.content,
      parentMessageId: branchedMessage.parentMessageId,
      editedAt: branchedMessage.editedAt,
      versions: branchedMessage.versions.map(v => ({ oldContent: v.oldContent, createdAt: v.createdAt })),
      diff: `${message.content} → ${newContent}`
    };
  }

   private buildTree(messages: ChatMessage[]): TreeNode[] {
  const map = new Map<string, TreeNode>();

  // Create all nodes
  messages.forEach(msg => {
    map.set(msg.id, {
      id: msg.id,
      role: msg.role,
      content: msg.content,
      createdAt: msg.createdAt,
      editedAt: msg.editedAt,
      children: [],
    });
  });

  const roots: TreeNode[] = [];

  // Build relationships
  messages.forEach(msg => {
    const node = map.get(msg.id)!;

    // CASE 1: Branch message
    if (msg.parentMessageId) {
      const parent = map.get(msg.parentMessageId);
      if (parent) {
        parent.children.push(node);
        return;
      }
    }

    // CASE 2: Agent reply → attach to closest previous user message
    if (msg.role === "agent") {
      const prev = [...messages]
        .filter(m => m.createdAt < msg.createdAt && !m.parentMessageId)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];

      if (prev) {
        map.get(prev.id)!.children.push(node);
        return;
      }
    }

    // CASE 3: User root message
    roots.push(node);
  });

  return roots;
}


  private buildForest(messages: ChatMessage[]): TreeNode[] {
  return this.buildTree(messages).filter(node => !node.parentMessageId);
}

async visualizeSession(sessionId: string) {
  const session = await this.chatDao.getFullSession(sessionId);
  if (!session) throw new Error('Session not found');

  const forest = this.buildForest(session.messages);

  return {
    sessionId,
    tree: forest,
    visualization: this.treeToText(forest),
  };
}

 private treeToText(nodes: TreeNode[], indent = ""): string {
  let output = "";

  nodes.forEach((node, index) => {
    const isLast = index === nodes.length - 1;

    const prefix =
      indent === ""
        ? ""
        : isLast
          ? indent + "└─ "
          : indent + "├─ ";

    output += `${prefix}${node.role[0].toUpperCase()}: ${node.content}\n`;

    const childIndent =
      indent === ""
        ? "   "
        : isLast
          ? indent + "   "
          : indent + "│  ";

    output += this.treeToText(node.children, childIndent);
  });

  return output;
}





}


