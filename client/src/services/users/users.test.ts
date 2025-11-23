import { describe, it, expect, vi } from 'vitest';

import { api } from '../axios/api';
import { users } from './users';

vi.mock('../axios/api', () => ({
    api: {
        get: vi.fn(),
    },
}));

describe('users API', () => {
    describe('userHistory', () => {
        it('should call api.get with the correct URL', async () => {
            await users.userHistory('123');

            expect(api.get).toHaveBeenCalledWith('/user/:123/history');
        });

        it('should return the api response', async () => {
            const mockResponse = { data: { ok: true } };

            (api.get as any).mockResolvedValue(mockResponse);

            const res = await users.userHistory('789');

            expect(res).toBe(mockResponse);
        });
    });
});
