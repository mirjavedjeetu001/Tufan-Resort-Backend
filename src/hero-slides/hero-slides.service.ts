import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HeroSlide } from '../entities/hero-slide.entity';

@Injectable()
export class HeroSlidesService {
  constructor(
    @InjectRepository(HeroSlide)
    private slideRepository: Repository<HeroSlide>,
  ) {}

  async findAll() {
    return this.slideRepository.find({ order: { order: 'ASC' } });
  }

  async findActive() {
    return this.slideRepository.find({
      where: { isActive: true },
      order: { order: 'ASC' },
    });
  }

  async findOne(id: number) {
    return this.slideRepository.findOne({ where: { id } });
  }

  async create(slideData: Partial<HeroSlide>) {
    const slide = this.slideRepository.create(slideData);
    return this.slideRepository.save(slide);
  }

  async update(id: number, slideData: Partial<HeroSlide>) {
    await this.slideRepository.update(id, slideData);
    return this.findOne(id);
  }

  async delete(id: number) {
    return this.slideRepository.delete(id);
  }
}
