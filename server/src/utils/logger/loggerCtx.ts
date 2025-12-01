import { AsyncLocalStorage } from 'async_hooks';

export const CtxAsyncLocalStorage = new AsyncLocalStorage<Record<string, unknown>>();
