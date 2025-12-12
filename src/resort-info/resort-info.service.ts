import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResortInfo } from '../entities/resort-info.entity';

@Injectable()
export class ResortInfoService {
  constructor(
    @InjectRepository(ResortInfo)
    private infoRepository: Repository<ResortInfo>,
  ) {}

  async get() {
    const info = await this.infoRepository.findOne({ where: { id: 1 } });
    return info;
  }

  async update(infoData: Partial<ResortInfo>) {
    const existing = await this.get();
    if (existing) {
      await this.infoRepository.update(1, infoData);
    } else {
      const info = this.infoRepository.create({ ...infoData, id: 1 });
      await this.infoRepository.save(info);
    }
    return this.get();
  }
}
