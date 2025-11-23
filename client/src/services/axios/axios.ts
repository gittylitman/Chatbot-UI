import axios, { AxiosResponse } from 'axios';
import qs from 'qs';
import { ERROR_MESSAGES } from './errorMessages';

type AlertEvent = { message: string };
let alertListener: ((event: AlertEvent) => void) | null = null;

export const registerAxiosAlertListener = (callback: (event: AlertEvent) => void) => {
  alertListener = callback;
};
export const unregisterAxiosAlertListener = () => {
  alertListener = null;
};

const STATUS_MESSAGES: Record<number, string> = {
  400: ERROR_MESSAGES.badRequest,
  401: ERROR_MESSAGES.unauthorized,
  403: ERROR_MESSAGES.forbidden,
  404: ERROR_MESSAGES.notFound,
  500: ERROR_MESSAGES.serverError,
};

const baseURL = import.meta.env.VITE_BASE_URL || 'http://127.0.0.1:2000/api';

export const axiosInstance = axios.create({
  baseURL,
  paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
});

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: any) => {
    if (!alertListener) return Promise.reject(error);

    let message = ERROR_MESSAGES.unknownError;

    if (error.response) {
      message = STATUS_MESSAGES[error.response.status] || ERROR_MESSAGES.unknownError;

      if (error.response.status === 401) {
        window.location.href = '/';
      }
    }

    alertListener({ message });
    return Promise.reject(error);
  }
);
