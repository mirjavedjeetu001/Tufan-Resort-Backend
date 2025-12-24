import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConventionBooking, PaymentStatus } from '../entities/convention-booking.entity';
import { ConventionPayment } from '../entities/convention-payment.entity';
import { ConventionHall } from '../entities/convention-hall.entity';
import { PaymentMethod } from '../entities/convention-booking.entity';

@Injectable()
export class ConventionBookingsService {
  constructor(
    @InjectRepository(ConventionBooking)
    private bookingRepository: Repository<ConventionBooking>,
    @InjectRepository(ConventionPayment)
    private paymentRepository: Repository<ConventionPayment>,
    @InjectRepository(ConventionHall)
    private hallRepository: Repository<ConventionHall>,
  ) {}

  async findAll() {
    return this.bookingRepository.find({
      relations: ['hall', 'createdBy', 'payments'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    return this.bookingRepository.findOne({
      where: { id },
      relations: ['hall', 'createdBy', 'payments'],
    });
  }

  async findByPhone(phone: string) {
    // Search by phone, NID, or other identifiers
    const booking = await this.bookingRepository
      .createQueryBuilder('booking')
      .where('booking.customerPhone = :phone', { phone })
      .orWhere('booking.customerNid = :phone', { phone })
      .orWhere('booking.customerWhatsapp = :phone', { phone })
      .orderBy('booking.createdAt', 'DESC')
      .getOne();
      
    if (booking) {
      return {
        customerName: booking.customerName,
        customerNid: booking.customerNid,
        customerPhone: booking.customerPhone,
        customerWhatsapp: booking.customerWhatsapp,
        customerEmail: booking.customerEmail,
        customerAddress: booking.customerAddress,
        organizationName: booking.organizationName,
      };
    }
    return null;
  }

  async findByDate(date: Date) {
    return this.bookingRepository.find({
      where: { eventDate: date },
      relations: ['hall'],
    });
  }

  private normalizeNumeric(value: any) {
    if (value === null || value === undefined) return 0;
    const str = String(value).trim();
    if (str === '') return 0;
    // keep only digits, dot, minus; collapse multiple dots to the first occurrence
    const cleaned = (() => {
      const filtered = str.replace(/[^0-9.-]/g, '');
      const firstDot = filtered.indexOf('.');
      if (firstDot === -1) return filtered;
      const before = filtered.slice(0, firstDot + 1);
      const after = filtered.slice(firstDot + 1).replace(/\./g, '');
      return before + after;
    })();
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  }

  private calculateTotals(payload: Partial<ConventionBooking>) {
    const hallRent = this.normalizeNumeric(payload.hallRent);
    const foodCost = this.normalizeNumeric(payload.foodCost);
    const addonsCost = this.normalizeNumeric(payload.addonsCost);
    const discount = this.normalizeNumeric(payload.discount);
    const vatAmount = this.normalizeNumeric(payload.vatAmount);
    const advancePayment = this.normalizeNumeric(payload.advancePayment);

    const totalAmount = Math.max(0, hallRent + foodCost + addonsCost - discount + vatAmount);
    const remainingPayment = Math.max(0, totalAmount - advancePayment);
    const paymentStatus: PaymentStatus = remainingPayment <= 0
      ? PaymentStatus.PAID
      : advancePayment > 0
        ? PaymentStatus.PARTIAL
        : PaymentStatus.PENDING;

    return {
      hallRent,
      foodCost,
      addonsCost,
      discount,
      vatAmount,
      advancePayment,
      totalAmount,
      remainingPayment,
      paymentStatus,
    };
  }

  async create(bookingData: Partial<ConventionBooking>) {
    if (typeof bookingData.selectedAddons === 'string') {
      try {
        bookingData.selectedAddons = bookingData.selectedAddons.trim() ? JSON.parse(bookingData.selectedAddons) : [];
      } catch (error) {
        bookingData.selectedAddons = [];
      }
    }

    if (typeof bookingData.addonQuantities === 'string') {
      try {
        bookingData.addonQuantities = bookingData.addonQuantities.trim() ? JSON.parse(bookingData.addonQuantities) : {};
      } catch (error) {
        bookingData.addonQuantities = {};
      }
    }

    const totals = this.calculateTotals(bookingData);
    const booking = this.bookingRepository.create({
      ...bookingData,
      ...totals,
    });

    const saved = await this.bookingRepository.save(booking);
    return this.findOne(saved.id);
  }

  async update(id: number, bookingData: Partial<ConventionBooking>) {
    const existing = await this.bookingRepository.findOne({ where: { id }, relations: ['payments'] });
    if (!existing) return null;

    if (typeof bookingData.selectedAddons === 'string') {
      try {
        bookingData.selectedAddons = bookingData.selectedAddons.trim() ? JSON.parse(bookingData.selectedAddons) : [];
      } catch (error) {
        bookingData.selectedAddons = existing.selectedAddons;
      }
    }

    if (typeof bookingData.addonQuantities === 'string') {
      try {
        bookingData.addonQuantities = bookingData.addonQuantities.trim() ? JSON.parse(bookingData.addonQuantities) : {};
      } catch (error) {
        bookingData.addonQuantities = existing.addonQuantities || {};
      }
    }

    const merged = { ...existing, ...bookingData } as ConventionBooking;
    const totals = this.calculateTotals(merged);

    await this.bookingRepository.update(id, { ...bookingData, ...totals });
    return this.findOne(id);
  }

  async delete(id: number) {
    return this.bookingRepository.delete(id);
  }

  async addPayment(bookingId: number, payload: { amount: number; method: PaymentMethod; note?: string }) {
    const booking = await this.bookingRepository.findOne({ where: { id: bookingId } });
    if (!booking) return null;

    const amount = this.normalizeNumeric(payload.amount);
    const payment = this.paymentRepository.create({
      bookingId,
      amount,
      method: payload.method,
      note: payload.note || null,
    });
    await this.paymentRepository.save(payment);

    const newAdvance = this.normalizeNumeric(booking.advancePayment) + amount;
    const totalAmount = this.normalizeNumeric(booking.totalAmount);
    const remainingPayment = Math.max(0, totalAmount - newAdvance);
    const paymentStatus: PaymentStatus = remainingPayment <= 0
      ? PaymentStatus.PAID
      : newAdvance > 0
        ? PaymentStatus.PARTIAL
        : PaymentStatus.PENDING;

    await this.bookingRepository.update(bookingId, {
      advancePayment: newAdvance,
      remainingPayment,
      paymentStatus,
    });

    return this.findOne(bookingId);
  }

  async availability(date: Date, timeSlot: string) {
    return this.bookingRepository.find({
      where: { eventDate: date },
      relations: ['hall'],
    }).then((bookings) => bookings.filter((b) => b.status !== 'cancelled' && this.timeSlotOverlaps(b.timeSlot, timeSlot)));
  }

  async getAvailableHalls(date: Date, timeSlot: string) {
    try {
      // Normalize date to start of day for consistent comparison
      const searchDate = new Date(date);
      searchDate.setHours(0, 0, 0, 0);

      // Get all halls
      const allHalls = await this.hallRepository.find();

      // Get all bookings for the given date
      const allBookings = await this.bookingRepository.find({
        relations: ['hall'],
      });

      // Filter bookings for the same date
      const sameDayBookings = allBookings.filter(booking => {
        const bookingDate = new Date(booking.eventDate);
        bookingDate.setHours(0, 0, 0, 0);
        return bookingDate.getTime() === searchDate.getTime();
      });

      // Get hall IDs that are booked for the requested time slot
      const bookedHallIds = sameDayBookings
        .filter(b => b.status !== 'cancelled' && this.timeSlotOverlaps(b.timeSlot, timeSlot))
        .map(b => b.hallId);

      // Return halls that are not booked
      const availableHalls = allHalls.filter(hall => !bookedHallIds.includes(hall.id));

      return {
        availableHalls,
        bookedHallIds,
        totalHalls: allHalls.length,
        availableCount: availableHalls.length,
      };
    } catch (error) {
      console.error('Error getting available halls:', error);
      throw error;
    }
  }

  async checkHallAvailability(hallId: number, date: Date, timeSlot: string) {
    try {
      const hall = await this.hallRepository.findOne({ where: { id: hallId } });
      if (!hall) {
        throw new Error('Hall not found');
      }

      // Normalize date to start of day for consistent comparison
      const searchDate = new Date(date);
      searchDate.setHours(0, 0, 0, 0);

      const existingBookings = await this.bookingRepository.find({
        where: { 
          hallId,
        },
        relations: ['hall'],
      });

      // Filter bookings for the same date
      const sameDayBookings = existingBookings.filter(booking => {
        const bookingDate = new Date(booking.eventDate);
        bookingDate.setHours(0, 0, 0, 0);
        return bookingDate.getTime() === searchDate.getTime();
      });

      const conflictingBookings = sameDayBookings.filter(
        (b) => b.status !== 'cancelled' && this.timeSlotOverlaps(b.timeSlot, timeSlot)
      );

      const available = conflictingBookings.length === 0;

      return {
        available,
        hall,
        conflictingBookings: available ? [] : conflictingBookings,
        message: available 
          ? `${hall.name} is available for ${timeSlot} on ${searchDate.toLocaleDateString('en-GB')}`
          : `${hall.name} is already booked for ${timeSlot} on ${searchDate.toLocaleDateString('en-GB')}`
      };
    } catch (error) {
      console.error('Error checking hall availability:', error);
      throw error;
    }
  }

  private timeSlotOverlaps(existing: string, incoming: string) {
    if (!existing || !incoming) return false;
    if (existing === 'fullday' || incoming === 'fullday') return true;
    if (existing === 'custom' || incoming === 'custom') return true; // For custom times, assume overlap
    return existing === incoming;
  }
}
