import { describe, it, expect, vi } from 'vitest';
import { api } from '../axios/api';
import { session } from './session';

vi.mock('../axios/api', () => ({
  api: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

describe('session API', () => {

  describe('createSession', () => {
    it('should call api.post with the correct URL', async () => {
      await session.createSession("12345");

      expect(api.post).toHaveBeenCalledWith('/session/:12345');
    });
  });

  describe('getSession', () => {
    it('should call api.get with the correct URL', async () => {
      await session.getSession("abcde");

      expect(api.get).toHaveBeenCalledWith('/session/:abcde');
    });
  });

  describe('sendMessage', () => {
    it('should call api.post with the correct URL and message body', async () => {
      const msg = { text: "hello" };

      await session.sendMessage("xyz", msg);

      expect(api.post).toHaveBeenCalledWith('/session/:xyz/message', msg);
    });
  });
  describe('deleteSession', () => {
    it('should call api.delete with the correct URL', async () => {
      await session.deleteSession("del123");
      expect(api.delete).toHaveBeenCalledWith('/session/:del123/');
    });
  });

});
