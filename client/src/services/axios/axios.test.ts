import AxiosMockAdapter from 'axios-mock-adapter';
import { beforeAll, beforeEach, afterEach, describe, expect, it, vi } from 'vitest';

import { ERROR_MESSAGES } from './errorMessages';
import { axiosInstance, registerAxiosAlertListener, unregisterAxiosAlertListener } from './axios';

const errors = [
    { status: 400, message: ERROR_MESSAGES.badRequest, url: '/bad-request' },
    { status: 401, message: ERROR_MESSAGES.unauthorized, url: '/unauthorized' },
    { status: 403, message: ERROR_MESSAGES.forbidden, url: '/forbidden' },
    { status: 404, message: ERROR_MESSAGES.notFound, url: '/not-found' },
    { status: 500, message: ERROR_MESSAGES.serverError, url: '/server-error' },
    { status: 0, message: ERROR_MESSAGES.unknownError, url: '/unknown-error' },
];

describe('RESPONSE INTERCEPTOR', () => {
    let mock: AxiosMockAdapter;
    let originalLocation: Location;
    let alertSpy: ReturnType<typeof vi.fn>;

    beforeAll(() => {
        mock = new AxiosMockAdapter(axiosInstance);
    });

    beforeEach(() => {
        originalLocation = window.location;
        delete (window as any).location;
        (window as any).location = { href: '' };

        alertSpy = vi.fn();
        registerAxiosAlertListener(alertSpy);
    });

    afterEach(() => {
        unregisterAxiosAlertListener();
        window.location = originalLocation;
        mock.reset();
    });

    it('should return response data on successful request', async () => {
        const data = { message: 'Success' };
        mock.onGet('/success').reply(200, data);

        const response = await axiosInstance.get('/success');
        expect(response.data).toEqual(data);
        expect(alertSpy).not.toHaveBeenCalled();
    });

    it('should handle successful POST request', async () => {
        const data = { message: 'Created' };
        mock.onPost('/create').reply(201, data);

        const response = await axiosInstance.post('/create', { name: 'Test' });
        expect(response.data).toEqual(data);
        expect(alertSpy).not.toHaveBeenCalled();
    });

    it('should redirect to / on 401 error', async () => {
        const url = '/unauthorized';
        mock.onGet(url).reply(401, { message: 'Unauthorized' });

        await axiosInstance.get(url).catch(() => {});
        expect(window.location.href).toBe('/');
        expect(alertSpy).toHaveBeenCalledWith({ message: ERROR_MESSAGES.unauthorized });
    });

    it('should handle 404 error without redirect', async () => {
        const url = '/not-found';
        mock.onGet(url).reply(404, { message: 'Not Found' });

        await axiosInstance.get(url).catch(() => {});
        expect(window.location.href).toBe('');
        expect(alertSpy).toHaveBeenCalledWith({ message: ERROR_MESSAGES.notFound });
    });

    errors.forEach(({ status, message, url }) => {
        if (status === 401 || status === 404) return;

        it(`should handle ${status} error`, async () => {
            mock.onGet(url).reply(status, { message: 'Detailed error message' });
            await axiosInstance.get(url).catch(() => {});
            expect(alertSpy).toHaveBeenCalledWith({ message });
        });
    });
});
