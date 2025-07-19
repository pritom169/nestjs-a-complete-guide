import {
  Controller,
  Get,
  Header,
  HttpCode,
  Post,
  Param,
  Body,
} from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';

@Controller('cats')
export class CatsController {
  @Post()
  @HttpCode(201)
  @Header('Cache-Control', 'No idea about the cache')
  create(@Body() createCatDto: CreateCatDto): string {
    console.log(createCatDto);
    return 'This action adds a new cat';
  }

  @Get()
  findAll(): string {
    return 'This action returns all cats';
  }

  @Get('async')
  async findAllAsync(): Promise<string[]> {
    return await Promise.resolve(['Persian', 'Siamese', 'Maine Coon']);
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
