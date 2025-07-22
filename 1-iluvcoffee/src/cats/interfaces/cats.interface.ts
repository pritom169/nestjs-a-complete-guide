import { Entity } from 'typeorm';

@Entity()
export class Cat {
  id: number;
  name: string;
  age: number;
  breed: string;
  activities: string[];
}
