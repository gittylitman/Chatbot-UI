import { generateId } from './id';

describe('generateId', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  it('check create with DB_ENTITIES_ID env vars', () => {
    process.env.DB_ENTITIES_ID = 'test';
    const newId = generateId('new');
    expect(newId).toMatch(new RegExp('^(new_test_)[0-9a-f]{32}$'));
  });

  it('check create without DB_ENTITIES_ID env vars', () => {
    const newId = generateId('new');
    expect(newId).toMatch(new RegExp('^(new_)[0-9a-f]{32}$'));
  });

  afterAll(() => {
    process.env = OLD_ENV; // Restore old environment
  });
});
