export class ChatSessionNotFoundError extends Error {
  constructor(override readonly message: string) {
    super('chat session not found');
    this.name = 'ChatSessionNotFoundError';
    this.message = message;
  }
}


export class ChatMessageNotFoundError extends Error {
  constructor(override readonly message: string) {
    super('chat message not found');
    this.name = 'ChatMessageNotFoundError';
    this.message = message;
  }
}

export class UserAlreadyExistError extends Error {
  constructor(override readonly message: string) {
    super('user already exist');
    this.name = 'UserAlreadyExistError';
    this.message = message;
  }
}




