import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConventionBooking, PaymentStatus } from '../entities/convention-booking.entity';
import { ConventionPayment } from '../entities/convention-payment.entity';
import { PaymentMethod } from '../entities/convention-booking.entity';

@Injectable()
export class ConventionBookingsService {
  constructor(
    @InjectRepository(ConventionBooking)
    private bookingRepository: Repository<ConventionBooking>,
    @InjectRepository(ConventionPayment)
    private paymentRepository: Repository<ConventionPayment>,
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
    const advancePayment = this.normalizeNumeric(payload.advancePayment);

    const totalAmount = Math.max(0, hallRent + foodCost + addonsCost - discount);
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

  private timeSlotOverlaps(existing: string, incoming: string) {
    if (!existing || !incoming) return false;
    if (existing === 'fullday' || incoming === 'fullday') return true;
    return existing === incoming;
  }
}
