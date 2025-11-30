import { Message } from './Message';

export interface Session {
    id: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    messages: Array<Message>;
}
