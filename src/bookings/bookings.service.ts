import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Booking, BookingStatus } from '../entities/booking.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
  ) {}

  async findAll() {
    return this.bookingRepository.find({
      relations: ['room', 'createdBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    return this.bookingRepository.findOne({
      where: { id },
      relations: ['room', 'createdBy'],
    });
  }

  async findByDateRange(startDate: Date, endDate: Date) {
    return this.bookingRepository.find({
      where: {
        checkInDate: Between(startDate, endDate),
      },
      relations: ['room'],
    });
  }

  async create(bookingData: Partial<Booking>) {
    const booking = this.bookingRepository.create(bookingData);
    return this.bookingRepository.save(booking);
  }

  async update(id: number, bookingData: Partial<Booking>) {
    await this.bookingRepository.update(id, bookingData);
    return this.findOne(id);
  }

  async delete(id: number) {
    return this.bookingRepository.delete(id);
  }

  async getMetrics() {
    const totalBookings = await this.bookingRepository.count();
    const confirmedBookings = await this.bookingRepository.count({
      where: { status: BookingStatus.CONFIRMED },
    });
    const totalRevenue = await this.bookingRepository
      .createQueryBuilder('booking')
      .select('SUM(booking.totalAmount)', 'total')
      .getRawOne();

    return {
      totalBookings,
      confirmedBookings,
      totalRevenue: totalRevenue.total || 0,
    };
  }
}
