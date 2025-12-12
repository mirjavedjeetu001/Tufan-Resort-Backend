import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConventionHall } from '../entities/convention-hall.entity';

@Injectable()
export class ConventionHallService {
  constructor(
    @InjectRepository(ConventionHall)
    private hallRepository: Repository<ConventionHall>,
  ) {}

  async findAll() {
    return this.hallRepository.find();
  }

  async findOne(id: number) {
    return this.hallRepository.findOne({ where: { id } });
  }

  async create(hallData: Partial<ConventionHall>) {
    const hall = this.hallRepository.create(hallData);
    return this.hallRepository.save(hall);
  }

  async update(id: number, hallData: Partial<ConventionHall>) {
    await this.hallRepository.update(id, hallData);
    return this.findOne(id);
  }

  async delete(id: number) {
    return this.hallRepository.delete(id);
  }
}
