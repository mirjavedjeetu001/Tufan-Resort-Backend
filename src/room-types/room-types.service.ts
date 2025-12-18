import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomTypeEntity } from '../entities/room-type.entity';

@Injectable()
export class RoomTypesService {
  constructor(
    @InjectRepository(RoomTypeEntity)
    private roomTypesRepository: Repository<RoomTypeEntity>,
  ) {}

  findAll() {
    return this.roomTypesRepository.find({ order: { name: 'ASC' } });
  }

  findActive() {
    return this.roomTypesRepository.find({ 
      where: { isActive: true },
      order: { name: 'ASC' }
    });
  }

  findOne(id: number) {
    return this.roomTypesRepository.findOneBy({ id });
  }

  create(createDto: Partial<RoomTypeEntity>) {
    const roomType = this.roomTypesRepository.create(createDto);
    return this.roomTypesRepository.save(roomType);
  }

  async update(id: number, updateDto: Partial<RoomTypeEntity>) {
    await this.roomTypesRepository.update(id, updateDto);
    return this.findOne(id);
  }

  async toggleActive(id: number, isActive: boolean) {
    await this.roomTypesRepository.update(id, { isActive });
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.roomTypesRepository.delete(id);
    return { deleted: true };
  }

  async seedDefaults() {
    const count = await this.roomTypesRepository.count();
    if (count > 0) {
      return { message: 'Room types already exist', count };
    }

    const defaultTypes = [
      { name: 'Standard', description: 'Basic comfortable rooms with essential amenities', isActive: true },
      { name: 'Deluxe', description: 'Enhanced rooms with premium amenities and lake view', isActive: true },
      { name: 'Suite', description: 'Luxurious suites with separate living area', isActive: true },
      { name: 'Family', description: 'Spacious rooms perfect for families with extra beds', isActive: true },
      { name: 'Presidential', description: 'Premium presidential suite with exclusive amenities', isActive: true },
    ];

    const created = await this.roomTypesRepository.save(defaultTypes);
    return { message: 'Default room types created', count: created.length, types: created };
  }
}
