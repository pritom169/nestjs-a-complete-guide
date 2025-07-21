import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Patch,
  Query,
  Body,
} from '@nestjs/common';
import { CatsService } from './cats.service';

@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Get()
  findAll(@Query() paginationQuery: any) {
    return this.catsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.catsService.findOne(id);
  }

  @Post()
  create(@Body() body: any) {
    return this.catsService.create(body);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.catsService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.catsService.remove(id);
  }
}
