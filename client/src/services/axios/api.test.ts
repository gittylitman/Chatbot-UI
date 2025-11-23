import AxiosMockAdapter from 'axios-mock-adapter';
import { beforeAll, describe, expect, it } from 'vitest';

import { api } from './api';
import { axiosInstance } from './axios';

describe('AXIOS API', () => {
    let mock: AxiosMockAdapter;

    beforeAll(() => {
        mock = new AxiosMockAdapter(axiosInstance);
    });

    it('should make a GET request', async () => {
        const data = { message: 'success' };
        mock.onGet('/').reply(200, data);
        const response = await api.get('/');
        expect(response).toEqual(data);
    });

    it('should make a POST request', async () => {
        const postData = { name: 'Test' };
        const responseData = { message: 'created' };
        mock.onPost('/', postData).reply(201, responseData);
        const response = await api.post('/', postData);
        expect(response).toEqual(responseData);
    });
});
