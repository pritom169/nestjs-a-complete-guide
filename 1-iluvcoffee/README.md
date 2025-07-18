## Installing NestJS cli tool and creating project

First we have to make sure node is installed on our local machine. Once node is installed we have to install `npm install -g @nestjs/cli`.

Once it has been installed we can create a fresh nestjs project from the command line using

```bash
nest new 1-iluvcoffee
```

After the project has been created, navigate to the project and start it:

```bash
cd 1-iluvcoffee
npm run start:dev
```

## Controllers

A controller's purpose is to receive specific requests for the application. The routing mechanism controls which controller receives which requests. Frequently, each controller has more than one route, and different routes can perform different actions.

In order to create a basic controller, we use classes and decorators. Decorators associate classes with required metadata and enable Nest to create a routing map (tie requests to the corresponding controllers).

## Routing

Let's create a controller for cats

```bash
nest g controller cats
```

In the following example we'll use the @Controller() decorator which is required to define a basic controller. We'll specify an optional prefix of cats. Using a prefix in a Controller decorator allows us to avoid repeating ourselves when routes could potentially share a common prefix.

```ts
import { Controller, Get } from '@nestjs/common';

@Controller('cats')
export class CatsController {
  @Get()
  findAll(): string {
    return 'This action returns all cats';
  }
}
```

The @Get() decorator before the findAll() method tells Nest to create an endpoint for this particular route path and map every corresponding request to this handler. Since we've declared a prefix for every route ( cats), Nest will map every /catsGET request to this method.

When a GET request is made to this endpoint, Nest will now return a 200 status code and the associated response, which in this case is just a string. Why does that happen? Generally, we distinguish two different approaches to manipulate responses:

**Recommended Approach:** When we return a JavaScript object or array, it'll be automatically serialized to JSON. When we return a string however, Nest will send just a string without attempting to serialize it.

Furthermore, the response's status code is always 200 by default, except for POST requests which use 201. We can easily change this behaviour by adding the @HttpCode(...) decorator at a handler-level.

**Library-specific Approach:** We can use the library specific response object, which we can inject using the @Res() decorator in the function signature (e.g. findAll(@Res() response)).

> It is forbiddn to use both approaches at the same time. Nest detects whether the handler is using either @Res() or @Next(). If both approaches are used in the same time - the Standard approach is automatically disabled for this single route and will no longer work as expected.

## Request object
A lot of endpoints need access to the client request details. In fact, Nest is using a library-specific (express by default) request object. As a result, we can force Nest to inject the request object into the handler using the @Req() decorator.

```ts
import { Controller, Get, Req } from '@nestjs/common';

@Controller('cats')
export class CatsController {
  @Get()
  findAll(@Req() request: Request): string {
    console.log(request);
    return 'This action returns all cats';
  }
}
```

The request object represents the HTTP request and has properties for the request query string, parameters, HTTP headers, and body. In most cases, it's not necessary to grab these properties manually. We can use dedicated decorators instead, such as @Body() or @Query(), which are available out of the box. Below is a comparison of the provided decorators and the plain express objects they represent.

| Decorator            | Equivalent Expression              |
|----------------------|------------------------------------|
| `@Request()`         | `req`                              |
| `@Response()`        | `res`                              |
| `@Next()`            | `next`                             |
| `@Session()`         | `req.session`                      |
| `@Param(param?)`     | `req.params` / `req.params[param]` |
| `@Body(param?)`      | `req.body` / `req.body[param]`     |
| `@Query(param?)`     | `req.query` / `req.query[param]`   |
| `@Headers(param?)`   | `req.headers` / `req.headers[param]` |

## Resources
We defined an endpoint to fetch the cats resource (GET route). It will also be great to provide a way of creating new records as well. For this, let's create POST handler:

```ts
import { Controller, Get, Post } from '@nestjs/common';

@Controller('cats')
export class CatsController {
  @Post()
  create(): string {
    return 'This action adds a new cat';
  }

  @Get()
  findAll(): string {
    return 'This action returns all cats';
  }
}
```

Nest provides the rest of those endpoint decorators in the same fashion - @Put(), @Delete(), @Patch(), @Options(), @Head(), and @All(). All of them represent respective HTTP request methods.

