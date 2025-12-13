import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddonService, ServiceCategory } from '../entities/addon-service.entity';

@Injectable()
export class AddonServicesService {
  constructor(
    @InjectRepository(AddonService)
    private addonServicesRepository: Repository<AddonService>,
  ) {}

  async findAll(): Promise<AddonService[]> {
    return await this.addonServicesRepository.find({
      order: { category: 'ASC', price: 'ASC' },
    });
  }

  async findActive(): Promise<AddonService[]> {
    return await this.addonServicesRepository.find({
      where: { isActive: true },
      order: { category: 'ASC', price: 'ASC' },
    });
  }

  async findByCategory(category: ServiceCategory): Promise<AddonService[]> {
    return await this.addonServicesRepository.find({
      where: { category, isActive: true },
      order: { price: 'ASC' },
    });
  }

  async findOne(id: number): Promise<AddonService> {
    const addonService = await this.addonServicesRepository.findOne({
      where: { id },
    });

    if (!addonService) {
      throw new NotFoundException(`Addon service with ID ${id} not found`);
    }

    return addonService;
  }

  async create(addonServiceData: Partial<AddonService>): Promise<AddonService> {
    const addonService = this.addonServicesRepository.create(addonServiceData);
    return await this.addonServicesRepository.save(addonService);
  }

  async update(id: number, addonServiceData: Partial<AddonService>): Promise<AddonService> {
    const addonService = await this.findOne(id);
    Object.assign(addonService, addonServiceData);
    return await this.addonServicesRepository.save(addonService);
  }

  async remove(id: number): Promise<void> {
    const addonService = await this.findOne(id);
    await this.addonServicesRepository.remove(addonService);
  }

  async toggleActive(id: number): Promise<AddonService> {
    const addonService = await this.findOne(id);
    addonService.isActive = !addonService.isActive;
    return await this.addonServicesRepository.save(addonService);
  }

  async calculateTotalCost(serviceIds: number[]): Promise<number> {
    if (!serviceIds || serviceIds.length === 0) {
      return 0;
    }

    const services = await this.addonServicesRepository.findByIds(serviceIds);
    return services.reduce((total, service) => total + service.price, 0);
  }
}
