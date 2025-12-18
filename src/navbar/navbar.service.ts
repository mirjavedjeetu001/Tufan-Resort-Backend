import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NavbarLink } from '../entities/navbar-link.entity';

@Injectable()
export class NavbarService {
  constructor(
    @InjectRepository(NavbarLink)
    private navbarRepository: Repository<NavbarLink>,
  ) {}

  async findAll() {
    return this.navbarRepository.find({
      where: { parentId: null },
      relations: ['children'],
      order: { displayOrder: 'ASC' },
    });
  }

  async findActive() {
    return this.navbarRepository.find({
      where: { isActive: true, parentId: null },
      relations: ['children'],
      order: { displayOrder: 'ASC' },
    });
  }

  async create(data: Partial<NavbarLink>) {
    const link = this.navbarRepository.create(data);
    return this.navbarRepository.save(link);
  }

  async update(id: number, data: Partial<NavbarLink>) {
    await this.navbarRepository.update(id, data);
    return this.navbarRepository.findOne({ where: { id } });
  }

  async delete(id: number) {
    return this.navbarRepository.delete(id);
  }
}
