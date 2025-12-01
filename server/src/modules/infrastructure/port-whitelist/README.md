# NestJS Port Whitelist

Mechanism for serving different routes from the same [NestJS](https://nestjs.com/) application running on multiple ports.

---

## How to use:

### Step by step instructions:

1. Make your NestJS application listen to multiple ports by following [NestJS Docs - Multiple Simultaneous Servers](https://docs.nestjs.com/faq/multiple-servers#multiple-simultaneous-servers)

   All of the routes will be available from both ports.

2. Instantiate a new `PortHandle` for each port the application runs on

   ```typescript
   import { PortHandle } from '../infrastructure/port-whitelist';

   const portHandle1 = new PortHandle();
   const portHandle2 = new PortHandle();
   ```

   This holds a lazily initialized port.

3. Bootstrap the whitelist mechanism and configure it

   ```typescript
   import { NotFoundException } from '@nestjs/common';
   import { bootstrapPortWhitelists } from '../infrastructure/port-whitelist';

   const server = express();
   const api = await NestFactory.create(APIModule, new ExpressAdapter(server));
   bootstrapPortWhitelists(api, {
     defaultPort: portHandle1,
     onBlocked: () => {
       throw new NotFoundException();
     },
   });
   ```

   `defaultPort` is the port on which routes that weren't decorated/whitelisted will be available on.

4. Bind the port handles to the ports the application listens on

   ```typescript
   import http from 'http';

   const port1 = 3000;
   http.createServer(server).listen(port1);
   portHandle1.bindPort(port1);
   const port2 = 5000;
   http.createServer(server).listen(port2);
   portHandle2.bindPort(port2);
   ```

5. Add the `@WhitelistPort` decorator to Controller classes you want.

   ```typescript
   import { WhitelistPort } from '../infrastructure/port-whitelist';
   import { Controller } from '@nestjs/common';

   @Controller()
   @WhitelistPort(portHandle2)
   export class CatsController {}
   ```

   All routes in the decorated controller will be accessible only from the port bound to the handle.
   These routes won't be accessible from the default port.

### Full example:

```typescript
import express from 'express';
import { Module, Controller, Get } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { PortHandle, bootstrapPortWhitelists, WhitelistPort } from '../infrastructure/port-whitelist';

const defaultPortHandle = new PortHandle();
const metricsPortHandle = new PortHandle();

@Controller()
class ApplicativeController {
  @Get('/charge')
  charge() {
    return 'success';
  }
}

@Controller()
@WhitelistPort(metricsPortHandle)
class MetricsController {
  @Get('health')
  health() {
    return 'healthy';
  }
}

@Module({
  controllers: [ApplicativeController, MetricsController],
})
class APIModule {}

async function bootstrap() {
  const applicativePort = 3000;
  const metricsPort = 5000;

  const server = express();
  const api = await NestFactory.create(APIModule, new ExpressAdapter(server));
  bootstrapPortWhitelists(api, {
    defaultPort: defaultPortHandle,
    onBlocked: () => {
      throw new NotFoundException();
    },
  });
  await api.init();

  http.createServer(server).listen(applicativePort);
  applicativePortHandle.bindPort(applicativePort);
  http.createServer(server).listen(metricsPort);
  metricsPortHandle.bindPort(metricsPort);
}

bootstrap();
```

What will happen is:

- The application will listen on ports 3000 and 5000.
- `GET /charge` from port 3000 will succeed and respond with 'success'.
- `GET /health` from port 3000 will fail and respond with status 404.
- `GET /charge` from port 5000 will fail and respond with status 404.
- `GET /health` from port 5000 will succeed and respond with 'healthy'.

---

## Troubleshooting

- Routes in a controller decorated with some port are not accessible on that port
  - Check that the port handle has been bound to the correct port (`portHandle.bindPort(port)`)
- All routes are accessible from all ports regardless of whitelist
  - Check that the whitelist was bootstrapped (`bootstrapPortWhitelists(...)`)
- Unwhitelisted routes are accessible on a port that should have only whitelists
  - Check `defaultPort` configuration (argument of `bootstrapPortWhitelists(...)`)
- Blocked routes return 403 instead of 404
  - Check `onBlocked` configuration (argument of `bootstrapPortWhitelists(...)`) - make sure it throws `NotFoundException` from `@nestjs/common`.
