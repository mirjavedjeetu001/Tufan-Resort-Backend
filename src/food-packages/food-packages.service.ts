import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FoodPackage } from '../entities/food-package.entity';

@Injectable()
export class FoodPackagesService {
  constructor(
    @InjectRepository(FoodPackage)
    private foodPackagesRepository: Repository<FoodPackage>,
  ) {}

  async findAll(): Promise<FoodPackage[]> {
    return await this.foodPackagesRepository.find({
      order: { pricePerPerson: 'ASC' },
    });
  }

  async findActive(): Promise<FoodPackage[]> {
    return await this.foodPackagesRepository.find({
      where: { isActive: true },
      order: { pricePerPerson: 'ASC' },
    });
  }

  async findOne(id: number): Promise<FoodPackage> {
    const foodPackage = await this.foodPackagesRepository.findOne({
      where: { id },
    });

    if (!foodPackage) {
      throw new NotFoundException(`Food package with ID ${id} not found`);
    }

    return foodPackage;
  }

  async create(foodPackageData: Partial<FoodPackage>): Promise<FoodPackage> {
    const foodPackage = this.foodPackagesRepository.create(foodPackageData);
    return await this.foodPackagesRepository.save(foodPackage);
  }

  async update(id: number, foodPackageData: Partial<FoodPackage>): Promise<FoodPackage> {
    const foodPackage = await this.findOne(id);
    Object.assign(foodPackage, foodPackageData);
    return await this.foodPackagesRepository.save(foodPackage);
  }

  async remove(id: number): Promise<void> {
    const foodPackage = await this.findOne(id);
    await this.foodPackagesRepository.remove(foodPackage);
  }

  async toggleActive(id: number): Promise<FoodPackage> {
    const foodPackage = await this.findOne(id);
    foodPackage.isActive = !foodPackage.isActive;
    return await this.foodPackagesRepository.save(foodPackage);
  }

  calculateTotalCost(packageId: number, numberOfGuests: number): Promise<number> {
    return this.findOne(packageId).then(pkg => pkg.pricePerPerson * numberOfGuests);
  }
}
