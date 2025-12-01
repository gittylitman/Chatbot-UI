import { LoggerConfiguration, LogLevel } from './logger.interface';
import { ConcreteLogger, ErrorSerializer } from './private-types';
import { Logger } from './logger';

function mockErrorSerializer(): ErrorSerializer {
  return jest.fn().mockImplementation((i) => i as never);
}

type MockedLoggerInterfaceSubset = jest.Mocked<ConcreteLogger>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MockLoggerFactory = jest.Mock<MockedLoggerInterfaceSubset, any>;

function mockLoggerFactory(): MockLoggerFactory {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return jest.fn<MockedLoggerInterfaceSubset, any>().mockReturnValue({
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    flush: jest.fn(),
  });
}

type ContextStorage = {
  getStore(): Record<string, unknown> | undefined;
};

function mockContextStorage(): ContextStorage {
  const context = {};
  return {
    getStore: jest.fn().mockReturnValue(context),
  };
}

function loggerServiceFactory({
  configuration,
  loggerFactory,
  errorSerializer,
  contextStorage,
}: {
  configuration?: LoggerConfiguration;
  loggerFactory?: MockLoggerFactory;
  errorSerializer?: ErrorSerializer;
  contextStorage?: ContextStorage;
}): Logger {
  configuration ||= {};
  loggerFactory ||= mockLoggerFactory();
  errorSerializer ||= mockErrorSerializer();
  contextStorage ||= mockContextStorage();
  return new Logger(configuration, contextStorage, loggerFactory, errorSerializer);
}

describe('Logger service unit tests', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('When constructing', () => {
    const loggerFactory = mockLoggerFactory();

    describe('When not passing dependencies', () => {
      describe('When not passing configuration', () => {
        it('Should continue gracefully', () => {
          expect(
            () => new Logger(null as never, mockContextStorage(), mockLoggerFactory(), mockErrorSerializer()),
          ).not.toThrow();
        });
      });

      describe('When not passing trace', () => {
        it('Should continue gracefully', () => {
          expect(() => new Logger({}, mockContextStorage(), mockLoggerFactory(), mockErrorSerializer())).not.toThrow();
        });
      });

      describe('When not passing contextStorage', () => {
        describe('When passing null explicitly', () => {
          it('Should continue gracefully', () => {
            expect(() => new Logger({}, null as never, mockLoggerFactory(), mockErrorSerializer())).not.toThrow();
          });
        });

        describe('When not passing parameter', () => {
          it('Should continue gracefully', () => {
            expect(() => new Logger({})).not.toThrow();
          });
        });
      });

      describe('When not passing loggerFactory', () => {
        describe('When passing null explicitly', () => {
          it('Should continue gracefully', () => {
            expect(() => new Logger({}, mockContextStorage(), null as never, mockErrorSerializer())).not.toThrow();
          });
        });

        describe('When not passing parameter', () => {
          it('Should continue gracefully', () => {
            expect(() => new Logger({}, mockContextStorage())).not.toThrow();
          });
        });
      });

      describe('When not passing errorSerializer', () => {
        describe('When passing null explicitly', () => {
          it('Should continue gracefully', () => {
            expect(() => new Logger({}, mockContextStorage(), mockLoggerFactory(), null as never)).not.toThrow();
          });
        });

        describe('When not passing parameter', () => {
          expect(() => new Logger({}, mockContextStorage(), mockLoggerFactory())).not.toThrow();
        });
      });
    });

    describe('When specifying log level', () => {
      describe('When log level is "warn"', () => {
        beforeEach(() => {
          loggerServiceFactory({
            configuration: {
              level: 'warn',
            },
            loggerFactory,
          });
        });

        it('Should initialize logger once', () => {
          expect(loggerFactory).toHaveBeenCalledTimes(1);
        });

        it('Should initialize logger with level:warn', () => {
          expect(loggerFactory.mock.calls[0][0]).toMatchObject({ level: 'warn' });
        });
      });

      describe('When log level is "trace"', () => {
        beforeEach(() => {
          loggerServiceFactory({
            configuration: {
              level: 'trace',
            },
            loggerFactory,
          });
        });

        it('Should initialize logger once', () => {
          expect(loggerFactory).toHaveBeenCalledTimes(1);
        });

        it('Should initialize logger with level:trace', () => {
          expect(loggerFactory.mock.calls[0][0]).toMatchObject({ level: 'trace' });
        });
      });

      describe('When log level is undefined', () => {
        beforeEach(() => {
          loggerServiceFactory({
            configuration: {},
            loggerFactory,
          });
        });

        it('Should initialize logger once', () => {
          expect(loggerFactory).toHaveBeenCalledTimes(1);
        });

        it('Should initialize logger with level:trace', () => {
          expect(loggerFactory.mock.calls[0][0]).toMatchObject({ level: 'trace' });
        });
      });
    });

    describe('When specifying prettyPrint', () => {
      describe('When prettyPrint is true', () => {
        beforeEach(() => {
          loggerServiceFactory({
            configuration: { prettyPrint: true },
            loggerFactory,
          });
        });

        it('Should initialize logger once', () => {
          expect(loggerFactory).toHaveBeenCalledTimes(1);
        });

        it('Should specify pino-pretty as transport', () => {
          expect(loggerFactory.mock.calls[0][0]).toMatchObject({
            transport: {
              target: 'pino-pretty',
              options: {
                colorize: true,
                sync: true,
              },
            },
          });
        });
      });

      describe('When prettyPrint is false', () => {
        beforeEach(() => {
          loggerServiceFactory({
            configuration: { prettyPrint: false },
            loggerFactory,
          });
        });

        it('Should initialize logger once', () => {
          expect(loggerFactory).toHaveBeenCalledTimes(1);
        });

        it("Shouldn't specify any transports", () => {
          expect(loggerFactory.mock.calls[0][0].transport).toBeUndefined();
        });
      });

      describe('When prettyPrint is undefined', () => {
        beforeEach(() => {
          loggerServiceFactory({
            configuration: {},
            loggerFactory,
          });
        });

        it('Should initialize logger once', () => {
          expect(loggerFactory).toHaveBeenCalledTimes(1);
        });

        it("Shouldn't specify any transports", () => {
          expect(loggerFactory.mock.calls[0][0].transport).toBeUndefined();
        });
      });
    });
  });

  describe('When writing an entry', () => {
    let logger: Logger;
    const mockLogger: MockedLoggerInterfaceSubset = {
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      flush: jest.fn(),
    };

    beforeEach(() => {
      const loggerFactory = mockLoggerFactory();
      loggerFactory.mockReturnValue(mockLogger);
      logger = loggerServiceFactory({
        configuration: {},
        loggerFactory,
      });
    });

    const levels: Array<LogLevel> = ['debug', 'info', 'warn', 'error'];
    levels.forEach((level) => {
      describe(`When writing a ${level} entry`, () => {
        describe('When not given metadata', () => {
          const message = 'message';

          beforeEach(() => {
            logger[level](message);
          });

          it('Should call the concrete logger', () => {
            expect(mockLogger[level]).toHaveBeenCalledWith({}, message);
          });
        });

        describe('When not given an error in metadata', () => {
          describe('When metadata is a string', () => {
            const message = 'message';
            const metadata = { foo: 'bar' };

            beforeEach(() => {
              logger[level](message, metadata);
            });

            it('Should call the concrete logger', () => {
              expect(mockLogger[level]).toHaveBeenCalledWith(
                {
                  logData: metadata,
                },
                message,
              );
            });
          });

          describe('When metadata is an object', () => {
            const message = 'message';
            const metadata = { foo: { bar: 'baz' } };

            beforeEach(() => {
              logger[level](message, metadata);
            });

            it('Should call the concrete logger', () => {
              expect(mockLogger[level]).toHaveBeenCalledWith(
                {
                  logData: { foo: JSON.stringify(metadata.foo) },
                },
                message,
              );
            });
          });
        });

        describe('When given a normal exception in metadata', () => {
          const message = 'message';
          const error = new Error('test');
          const metadata = { foo: 'bar', error };

          beforeEach(() => {
            logger[level](message, metadata);
          });

          it('Should call the concrete logger', () => {
            expect(mockLogger[level]).toHaveBeenCalledWith(
              {
                logData: { foo: 'bar' },
                error: JSON.stringify(error),
              },
              message,
            );
          });
        });

        class FakeAxiosError extends Error {
          public isAxiosError = true;
          public foo = 'bar';

          public constructor(
            public request: Record<string, unknown>,
            public config: Record<string, unknown>,
            public response: Record<string, unknown>,
          ) {
            super('Fake axios error');
          }
        }

        describe('When given an axios error in metadata', () => {
          const message = 'message';
          const relevantResponse = {
            status: 500,
            statusText: 'Internal server error',
            headers: { header: 'header' },
            config: { config: 'config' },
            baseURL: 'localhost',
          };
          const error = new FakeAxiosError(
            { request: 'request' },
            { config: 'config' },
            {
              ...relevantResponse,
              foo: 'bar',
            },
          );
          const metadata = {
            foo: 'bar',
            error,
          };

          beforeEach(() => {
            logger[level](message, metadata);
          });

          it('Should call the concrete logger', () => {
            expect(mockLogger[level]).toHaveBeenCalledWith(
              {
                logData: { foo: 'bar' },
                error: JSON.stringify({
                  response: relevantResponse,
                  isAxiosError: true,
                  foo: 'bar',
                }),
              },
              message,
            );
          });
        });
      });
    });
  });

  describe('When adding metadata', () => {
    describe("When tracer doesn't exist", () => {
      let logger: Logger;

      describe('When metadata is added', () => {
        const metadata = { foo: 'bar' };

        beforeEach(() => {
          logger = loggerServiceFactory({
            configuration: {},
          });
        });

        it('Should not throw', () => {
          expect(() => logger.addMetadata(metadata)).not.toThrow();
        });
      });

      describe('When logging later', () => {
        const mockLogger: MockedLoggerInterfaceSubset = {
          debug: jest.fn(),
          info: jest.fn(),
          warn: jest.fn(),
          error: jest.fn(),
          flush: jest.fn(),
        };

        beforeEach(() => {
          const loggerFactory = mockLoggerFactory();
          loggerFactory.mockReturnValue(mockLogger);
          logger = loggerServiceFactory({
            configuration: {},
            loggerFactory,
          });
        });

        const metadata = { foo: 'bar' };
        const message = 'message';
        beforeEach(() => {
          logger.addMetadata(metadata);
          logger.debug(message);
        });

        it('Should contain metadata', () => {
          expect(mockLogger.debug).toHaveBeenCalledWith(
            {
              ...metadata,
              logData: undefined,
            },
            message,
          );
        });
      });
    });
  });

  describe('When flushing', () => {
    const mockLogger: MockedLoggerInterfaceSubset = {
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      flush: jest.fn(),
    };

    beforeEach(() => {
      const loggerFactory = mockLoggerFactory();
      loggerFactory.mockReturnValue(mockLogger);
      const logger = loggerServiceFactory({
        configuration: {},
        loggerFactory,
      });
      logger.flush();
    });

    it("Should call the concrete logger's flush", () => {
      expect(mockLogger.flush).toHaveBeenCalled();
    });
  });
});
