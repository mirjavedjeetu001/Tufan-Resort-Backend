import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConventionBooking } from '../entities/convention-booking.entity';

@Injectable()
export class ConventionBookingsService {
  constructor(
    @InjectRepository(ConventionBooking)
    private bookingRepository: Repository<ConventionBooking>,
  ) {}

  async findAll() {
    return this.bookingRepository.find({
      relations: ['hall', 'createdBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    return this.bookingRepository.findOne({
      where: { id },
      relations: ['hall', 'createdBy'],
    });
  }

  async findByDate(date: Date) {
    return this.bookingRepository.find({
      where: { eventDate: date },
      relations: ['hall'],
    });
  }

  async create(bookingData: Partial<ConventionBooking>) {
    const booking = this.bookingRepository.create(bookingData);
    return this.bookingRepository.save(booking);
  }

  async update(id: number, bookingData: Partial<ConventionBooking>) {
    await this.bookingRepository.update(id, bookingData);
    return this.findOne(id);
  }

  async delete(id: number) {
    return this.bookingRepository.delete(id);
  }
}
