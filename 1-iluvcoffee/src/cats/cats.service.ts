import { Injectable, NotFoundException } from '@nestjs/common';
import { Cat } from './interfaces/cats.interface';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';

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

  create(createCatDto: CreateCatDto): CreateCatDto {
    const newCat: Cat = {
      id: this.cats.length > 0 ? this.cats[this.cats.length - 1].id + 1 : 1,
      ...createCatDto,
    };
    this.cats.push(newCat);
    return newCat;
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

  update(id: string, cat: UpdateCatDto): void {
    const existingCat = this.findOne(id);
    if (existingCat) {
      const updatedCat: Cat = {
        ...existingCat,
        ...cat,
      };
      const catIndex = this.cats.findIndex((c) => c.id === +id);
      this.cats[catIndex] = updatedCat;
    }
  }

  remove(id: string): void {
    const catIndex = this.cats.findIndex((cat) => cat.id === +id);
    if (catIndex >= 0) {
      this.cats.splice(catIndex, 1);
    }
  }
}
