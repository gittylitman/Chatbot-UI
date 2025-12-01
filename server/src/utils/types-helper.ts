export type Nullable<T> = T | null;

export type JestSpyInstance<T extends (...args: never) => unknown> = jest.SpyInstance<ReturnType<T>, Parameters<T>>;
