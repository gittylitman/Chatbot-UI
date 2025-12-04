import { Message } from '../../interfaces/Message';
import { api } from '../axios/api';

export const messageApi = {
    editMessage: async (
        userId: string,
        messageId: string,
        newContent: string
    ): Promise<Message> => {
        return api.patch(`/message/${messageId}`, { userId: userId, content: newContent });
    },
};
