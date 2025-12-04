export interface Message {
    id: string;
    sessionId: string;
    role: string;
    content: string;
    action: string;
    createdAt: Date;
    editedAt?: Date;
    parentMessageId?: string;
    choices?: Array<string>;
    tableRows?: Array<any>;
    dataItems?: Array<string>;
}
