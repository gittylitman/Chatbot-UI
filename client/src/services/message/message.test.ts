import { describe, it, expect, vi } from 'vitest';

import { api } from '../axios/api';
import { messageApi } from './message';

vi.mock('../axios/api', () => ({
    api: {
        patch: vi.fn(),
    },
}));

describe('session API', () => {
    describe('editMessage', () => {
        it('should call api.patch with the correct URL and message body', async () => {
            const userId = '456';
            const messageId = '12345';
            const content = 'test';
            await messageApi.editMessage(userId, messageId, content);

            expect(api.patch).toHaveBeenCalledWith(`/message/${messageId}`, {
                userId: userId,
                content: content,
            });
        });
    });
});
