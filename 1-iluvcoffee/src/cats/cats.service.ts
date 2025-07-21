import { Body, Injectable, NotFoundException } from '@nestjs/common';
import { Cat } from './interfaces/cats.interface';
import { CreateCatDto } from './dto/create-cat.dto';

@Injectable()
export class CatsService {
  private readonly cats: Cat[] = [
    {
      id: 1,
      name: 'Bella',
      breed: 'Siamese',
      age: 2,
      activities: ['playing', 'sleeping'],
    },
  ];

  create(@Body() createCatDto: CreateCatDto): void {
    this.cats.push(createCatDto);
  }

  findOne(id: string): Cat | undefined {
    const coffee = this.cats.find((cat) => cat.id === +id);
    if (!coffee) {
      throw new NotFoundException(`Cat with id: ${id} not found`);
    }
    return coffee;
  }

  findAll(): Cat[] {
    return this.cats;
  }

  update(id: string, cat: any): void {
    const existingCat = this.findOne(id);
    if (existingCat) {
      // Update the existing cat with new values
    }
  }

  remove(id: string): void {
    const coffeeIndex = this.cats.findIndex((cat) => cat.id === +id);
    if (coffeeIndex >= 0) {
      this.cats.splice(coffeeIndex, 1);
    }
  }
}
