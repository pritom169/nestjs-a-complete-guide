import {
  Controller,
  Get,
  Post,
  Res,
  HttpStatus,
  Bind,
  Body,
} from '@nestjs/common';
import { Response } from 'express';
import { CreateCatDto } from './dto/create-cat.dto';
import { CatsService } from './cats.service';

@Controller('cats')
export class CatsController {
  constructor(private catsService: CatsService) {}

  @Post()
  @Bind(Res(), Body())
  create(res: Response, createCatDto: CreateCatDto): void {
    console.log('Cat created:', createCatDto);
    res.status(HttpStatus.CREATED).send('Cat created successfully');
  }

  @Get()
  @Bind(Res())
  findAll(res: Response): void {
    res.status(HttpStatus.OK).json('[]');
  }
}
