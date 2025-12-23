import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking, BookingStatus, PaymentStatus } from '../entities/booking.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
  ) {}

  async findAll() {
    await this.autoCheckoutOverdue();
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

  async findByPhone(phone: string) {
    // Search by phone, NID, or passport number
    const booking = await this.bookingRepository
      .createQueryBuilder('booking')
      .where('booking.customerPhone = :phone', { phone })
      .orWhere('booking.customerNid = :phone', { phone })
      .orWhere('booking.passportNumber = :phone', { phone })
      .orderBy('booking.createdAt', 'DESC')
      .getOne();
      
    if (booking) {
      return {
        guestName: booking.customerName,
        guestEmail: booking.customerEmail,
        guestPhone: booking.customerPhone,
        guestNid: booking.customerNid,
        guestAddress: booking.customerAddress,
        passportNumber: booking.passportNumber,
      };
    }
    return null;
  }

  async findByDateRange(startDate: Date, endDate: Date) {
    await this.autoCheckoutOverdue();
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
    const totalBookings = await this.bookingRepository.count({
      where: [
        { status: BookingStatus.CONFIRMED },
        { status: BookingStatus.CHECKED_IN },
        { status: BookingStatus.CHECKED_OUT },
      ],
    });
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

  // Auto-checkout any past-due stays and keep payment status pending if money is owed
  private async autoCheckoutOverdue() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const overdue = await this.bookingRepository
      .createQueryBuilder('booking')
      .where('booking.checkOutDate < CURRENT_DATE')
      .andWhere('booking.status NOT IN (:...statuses)', {
        statuses: [BookingStatus.CHECKED_OUT, BookingStatus.CANCELLED],
      })
      .getMany();

    if (!overdue.length) return;

    const updates = overdue.map((booking) => {
      const nextPaymentStatus = booking.remainingPayment > 0 ? PaymentStatus.PENDING : booking.paymentStatus;
      return this.bookingRepository.update(booking.id, {
        status: BookingStatus.CHECKED_OUT,
        paymentStatus: nextPaymentStatus,
      });
    });

    await Promise.all(updates);
  }
}
