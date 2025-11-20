import { api } from '../axios/api';

export const session = {
  createSession: async (user_id: string) => {
    return api.post(`/session/:${user_id}`);
  },
  getSession: async (session_id: string) => {
    return api.get(`/session/:${session_id}`);
  },
  sendMessage: async (session_id: string, message: object) => {
    return api.post(`/session/:${session_id}/message`,message);
  },
  delete : async (session_id: string)=>{
    return api.delete(`/session/:${session_id}/`)

  }
};



