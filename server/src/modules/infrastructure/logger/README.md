# Logger

This library exposes a `Logger` class, who's constructor receives the following dependencies:

- `Configuration` - a plain object with logger configuration
- `TraceService` - a class instance representing the Tracer (OpenTelemetry wrapper = Honeycomb)
- `ContextStorage` - a class instance with a method to get the context store. Should be an `AsyncLocalStorage` from `async_hooks`.
- `LoggerFactory` - a function which returns an instance of a logger. Defaults to [Pino](https://www.npmjs.com/package/pino).
- `ErrorSerializer` - a function which receives an error as an argument, and returns an object serializing the error. Defaults to [Pino.stdSerializers.err](https://github.com/pinojs/pino-std-serializers#exportserrerror)

This library also exposes a `LoggerService` class, which is a Nest provider (`@Injectable`) extending `Logger`.

To use this, create a [Nest `@Module`](https://docs.nestjs.com/modules#dynamic-modules) that `exports` this `LoggerService`, and define your own providers of: `Configuration`, `TraceService`, `ContextStorage`.
