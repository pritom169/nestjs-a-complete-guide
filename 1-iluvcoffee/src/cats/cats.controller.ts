import { Controller, Get, Header, HttpCode, Post, Param } from '@nestjs/common';

@Controller('cats')
export class CatsController {
  @Post()
  @HttpCode(201)
  @Header('Cache-Control', 'No idea about the cache')
  create(): string {
    return 'This action adds a new cat';
  }

  @Get()
  findAll(): string {
    return 'This action returns all cats';
  }

  @Get('ab*cd')
  findAllWildCard(): string {
    return 'This action returns all wildcard cats';
  }

  @Get(':id')
  findOne(@Param('id') id: string): string {
    return `This action returns a #${id} cat`;
  }
}
