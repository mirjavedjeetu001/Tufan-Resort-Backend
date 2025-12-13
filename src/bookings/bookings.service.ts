import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    return this.bookingRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.room', 'room')
      .where('booking.checkInDate < :endDate', { endDate })
      .andWhere('booking.checkOutDate > :startDate', { startDate })
      .orderBy('booking.checkInDate', 'ASC')
      .getMany();
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
    
    // Calculate revenue with discount and extra charges
    const revenueQuery = await this.bookingRepository
      .createQueryBuilder('booking')
      .select('SUM(booking.totalAmount + COALESCE(booking.extraCharges, 0) - ' +
              'CASE ' +
              'WHEN booking.discountType = "percentage" THEN (booking.totalAmount * COALESCE(booking.discountPercentage, 0) / 100) ' +
              'WHEN booking.discountType = "flat" THEN COALESCE(booking.discountAmount, 0) ' +
              'ELSE 0 END)', 'total')
      .getRawOne();

    return {
      totalBookings,
      confirmedBookings,
      totalRevenue: parseFloat(revenueQuery.total) || 0,
    };
  }
}
