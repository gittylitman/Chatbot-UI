import { api } from '../axios/api';

export const userApi = {
    userHistory: async (user_id: string) => {
        return api.get(`/user/${user_id}/history`);
    },
};
