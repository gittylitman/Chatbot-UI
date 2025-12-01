import { ChatSession, ChatMessage, MessageVersion, DataItem, MessageRole } from "@prisma/client";
import { Choice, CreateChatResponseType, DirectiveAction } from "../controller/chat.schema";

export interface SendMessageParams {
  type: CreateChatResponseType;
  content: string;
  choices?: Choice[];
  data?: object[];
  action: DirectiveAction;
};

export type FullChatMessage = ChatMessage & {
  branches: FullChatMessage[];       // recursive type
  versions: MessageVersion[];
  choices: Choice[];
  dataItems: DataItem[];
};

export type FullChatSession = ChatSession & {
  messages: FullChatMessage[];
};

export interface TreeNode {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: Date;
  editedAt?: Date | null;
  parentMessageId?: string | null;
  children: TreeNode[];
  versions?: { oldContent: string; createdAt: Date }[];
}