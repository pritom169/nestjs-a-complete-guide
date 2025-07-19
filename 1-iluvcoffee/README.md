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

## Route Wildcards
Pattern based routes are supported as well. For instance, the asterisk is used as a wildcard, and will match any combination of character(s).

```ts
@Get('ab*cd')
  findAllWildCard(): string {
    return 'This action returns all wildcard cats';
  }
```

This creates a wildcard route that matches URLs with a specific pattern. The * acts as a wildcard character.
What @Get('ab*cd') matches:

- /cats/abcd ✅
- /cats/abXcd ✅
- /cats/ab123cd ✅
- /cats/abANYTHINGcd ✅
- /cats/ab_hello_world_cd ✅

## Status Code
As mentioned, the response `status code` is always 200 by default, except for POST request which are 201. We can easily change this behavior by adding the @HttpCode(...) decorator at a handler-level.

```ts
@Post()
@HttpCode(204)
create() {
  return 'This action adds a new cat';
}
```

## Headers
To specify a custom response header, you can either use a @Header() decorator or a library-specific response object.

```ts
import {Header, Post} from '@nestjs/common';

@Controller('cats')
export class CatsController {
  @Post()
  @Header('Cache-Control', 'No idea about the cache')
  create(): string {
    return 'This action adds a new cat';
  }
}
```

## Route parameters
Routes with static paths can't help when you need to accept dynamic data as part of the URL. In order to define routes with parameters, we can directly particularise the route parameters in the path of the route.

```ts
import { Param } from '@nestjs/common';

@Controller('cats')
export class CatsController {
  @Get(':id')
  findOne(@Param() params: { id: string }): string {
    console.log(params);
    return `This action returns a #${params.id} cat`;
  }
}
```

### Particular Parameters in a route
In the previous request, the parameter we can simply pass its name in parenthesis.

```ts
@Get(':id')
  findOne(@Param('id') id: string): string {
    return `This action returns a #${id} cat`;
  }
```

## Async/await
We love modern JavaScript and we know that data extraction is mostly asynchronous. That's why Nest supports and works well with async functions.

Every async function has to return a Promise. It means that you can return a deferred value that Nest will be able to resolve by itself. Let's see an example of this below:

```ts
 @Get('async')
  async findAllAsync(): Promise<string[]> {
    return await Promise.resolve(['Persian', 'Siamese', 'Maine Coon']);
  }
```

> JavaScript is single Threaded and non-blocking, we need to clear some concept before we go forward in order to understand async/await properly. Hop into [this text](async.md) link to learn more about async / await.

## Request Payloads
Previous example of the POST route handler didn't accept any client params. Let's fix this by adding the @Body() argument here.

But first (if you use TypeScript), we need to determine the DTO (Data Transfer Object) schema. A DTO is an object that defines how the data will be sent over the network. We could determine the DTO schema by using TypeScript interfaces, or by simple classes. Surprisingly, we recommend using classes here. Why? Classes are part of the JavaScript ES6 standard, and therefore they represent plain functions. On the other hand, since TypeScript interfaces are removed during the transpilation, Nest can't refer to them. This is important because features such as Pipes enable additional possibilities when they have access to the metatype of the variable.

Let's create CreateDto inside the cats module:
```ts
// create-cat.dto.ts
export class CreateCatDto {
  readonly name?: string;
  readonly age?: number;
  readonly breed?: string;
}
```

- You might be asking why readonly?
- DTOs are meant to transfer data, not to be modified after creation. readonly prevents accidental mutations

- Why do we need the optional properties?
- Without optional TS expects that whenever you create an instance of this class, you must provide values for all three properties. If you try to create an instance without providing all required properties, TypeScript will show an error because it can't guarantee type safety. As a result, we add optionals which tells TS about the absense of any data.

Thereafter we can use the newly created schema inside the CatsController:
```ts
@Post()
async create(@Body() createCatDto: CreateCatDto) {
  return 'This action adds a new cat';
}
```

## Getting up and running
With the above controller fully prepared, Nest still does not know that `CatsController` exists and as a result won't create an instance of this class.

Controllers always belong to the the module, which is why hold the `controllers` array within the `@Module()` decorator. Since we don't have any other modules except the root `ApplicationModule`, we will use that to introduce the `CatsController`

```ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsController } from './cats/cats.controller';

@Module({
  imports: [],
  controllers: [AppController, CatsController],
  providers: [AppService],
})
export class AppModule {}
```
