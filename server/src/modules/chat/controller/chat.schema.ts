import { IsString } from 'class-validator';

export class CreateChatRequest {
  @IsString()
  message!: string;
}

export interface Choice {
  id: string;
  label: string;
}

export const CreateChatResponseType = {
  choices: 'choices',
  directive: 'directive',
  data: 'data',
  error: 'error',
  message: 'message'
} as const;
export type CreateChatResponseType = typeof CreateChatResponseType[keyof typeof CreateChatResponseType];


export const DirectiveAction = {
  ask: 'ask',
  end: 'end',
} as const;
export type DirectiveAction = typeof DirectiveAction[keyof typeof DirectiveAction];


export interface SendMessageResponse {
  id: string;
  responseId: string;

  type: CreateChatResponseType;
  content: string;
  choices?: Choice[];
  data?: object[];
  action: DirectiveAction;
};