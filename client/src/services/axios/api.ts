import { AxiosResponse } from 'axios';

import { axiosInstance } from './axios';

export const api = {
  get: <T>(url: string, params?: Record<string, any>): Promise<T> =>
    axiosInstance.get<T>(url, { params }).then((response: AxiosResponse<T>) => response.data),
  post: <T>(url: string, data?: any): Promise<T> =>
    axiosInstance.post<T>(url, data).then((response: AxiosResponse<T>) => response.data),
  delete: <T>(url: string): Promise<T> =>
    axiosInstance.delete<T>(url).then((response: AxiosResponse<T>) => response.data),
  
};
