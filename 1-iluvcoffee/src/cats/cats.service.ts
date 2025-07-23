import { Injectable, NotFoundException } from '@nestjs/common';
import { Cat } from './interfaces/cats.interface';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CatsService {
  constructor(
    @InjectRepository(Cat) private readonly catRepository: Repository<Cat>,
  ) {}

  create(createCatDto: CreateCatDto): Promise<Cat> {
    const cat = this.catRepository.create(createCatDto);
    return this.catRepository.save(cat);
  }

  async findOne(id: string): Promise<Cat> {
    const cat = await this.catRepository.findOne({ where: { id: +id } });
    if (!cat) {
      throw new NotFoundException(`Cat with ID ${id} not found`);
    }
    return cat;
  }

  findAll(): Promise<Cat[]> {
    return this.catRepository.find();
  }

  async update(id: string, updateCatDto: UpdateCatDto): Promise<Cat> {
    const cat = await this.catRepository.preload({
      id: +id,
      ...updateCatDto,
    });

    if (!cat) {
      throw new NotFoundException(`Cat with ${id} not found`);
    }

    return this.catRepository.save(cat);
  }

  async remove(id: string): Promise<Cat> {
    const cat = await this.findOne(id);
    return this.catRepository.remove(cat);
  }
}
