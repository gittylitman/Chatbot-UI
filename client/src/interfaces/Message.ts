export interface Message {
    id: string;
    sessionId: string;
    role: string;
    content: string;
    action: string;
    createdAt: Date;
    choices?: Array<string>;
    dataItems?: Array<string>;
}
