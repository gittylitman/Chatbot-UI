import { Answer } from '../../interfaces/Answer';
import { Session } from '../../interfaces/Session';
import { api } from '../axios/api';

export const sessionApi = {
    createSession: async (user_id: string): Promise<Session> => {
        return api.post(`/session/:${user_id}`);
    },
    getSession: async (session_id: string): Promise<Session> => {
        return api.get(`/session/:${session_id}`);
    },
    sendMessage: async (session_id: string, message: object): Promise<Answer> => {
        return api.post(`/session/:${session_id}/message`, message);
    },
    deleteSession: async (session_id: string): Promise<Session> => {
        return api.delete(`/session/:${session_id}/`);
    },
};
