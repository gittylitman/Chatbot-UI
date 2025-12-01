import { Session } from '../../interfaces/Session';
import { api } from '../axios/api';

export const userApi = {
    userHistory: async (user_id: string): Promise<Array<Session>> => {
        return api.get(`/user/${user_id}/history`);
    },
};
