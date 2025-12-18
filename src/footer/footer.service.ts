import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FooterSection } from '../entities/footer-section.entity';
import { FooterLink } from '../entities/footer-link.entity';

@Injectable()
export class FooterService {
  constructor(
    @InjectRepository(FooterSection)
    private sectionRepository: Repository<FooterSection>,
    @InjectRepository(FooterLink)
    private linkRepository: Repository<FooterLink>,
  ) {}

  async findAllSections() {
    return this.sectionRepository.find({
      relations: ['links'],
      order: { displayOrder: 'ASC' },
    });
  }

  async findActiveSections() {
    const sections = await this.sectionRepository.find({
      where: { isActive: true },
      relations: ['links'],
      order: { displayOrder: 'ASC' },
    });
    return sections.map(section => ({
      ...section,
      links: section.links.filter(link => link.isActive).sort((a, b) => a.displayOrder - b.displayOrder),
    }));
  }

  async createSection(data: Partial<FooterSection>) {
    const section = this.sectionRepository.create(data);
    return this.sectionRepository.save(section);
  }

  async updateSection(id: number, data: Partial<FooterSection>) {
    await this.sectionRepository.update(id, data);
    return this.sectionRepository.findOne({ where: { id } });
  }

  async deleteSection(id: number) {
    return this.sectionRepository.delete(id);
  }

  async createLink(data: Partial<FooterLink>) {
    const link = this.linkRepository.create(data);
    return this.linkRepository.save(link);
  }

  async updateLink(id: number, data: Partial<FooterLink>) {
    await this.linkRepository.update(id, data);
    return this.linkRepository.findOne({ where: { id } });
  }

  async deleteLink(id: number) {
    return this.linkRepository.delete(id);
  }
}
