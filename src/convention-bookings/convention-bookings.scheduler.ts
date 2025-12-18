import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, Not, In } from 'typeorm';
import { ConventionBooking, ProgramStatus, PaymentStatus } from '../entities/convention-booking.entity';

@Injectable()
export class ConventionBookingsScheduler {
  private readonly logger = new Logger(ConventionBookingsScheduler.name);

  constructor(
    @InjectRepository(ConventionBooking)
    private bookingRepository: Repository<ConventionBooking>,
  ) {}

  /**
   * Auto-complete convention bookings when event date/time has passed
   * Runs every hour at minute 0
   */
  @Cron(CronExpression.EVERY_HOUR)
  async autoCompleteConventions() {
    try {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      // Find bookings that should be completed
      const bookingsToComplete = await this.bookingRepository.find({
        where: {
          eventDate: LessThanOrEqual(today),
          programStatus: Not(In([ProgramStatus.COMPLETED, ProgramStatus.CANCELLED])),
        },
      });

      if (bookingsToComplete.length === 0) {
        return;
      }

      // Check time slots and complete those that have passed
      const updated = [];
      for (const booking of bookingsToComplete) {
        const eventDate = new Date(booking.eventDate);
        const isPastDate = eventDate < today;

        // If it's a past date, always complete
        if (isPastDate) {
          booking.programStatus = ProgramStatus.COMPLETED;
          updated.push(booking);
          continue;
        }

        // If it's today, check the time slot
        if (eventDate.toDateString() === today.toDateString()) {
          const currentHour = now.getHours();
          let shouldComplete = false;

          switch (booking.timeSlot.toLowerCase()) {
            case 'morning':
              // Morning ends at 12:00 PM
              shouldComplete = currentHour >= 12;
              break;
            case 'afternoon':
              // Afternoon ends at 6:00 PM
              shouldComplete = currentHour >= 18;
              break;
            case 'evening':
              // Evening ends at 11:00 PM
              shouldComplete = currentHour >= 23;
              break;
            case 'full-day':
            case 'full day':
              // Full day ends at 11:59 PM
              shouldComplete = currentHour >= 23;
              break;
            default:
              // Unknown time slot, complete if it's end of day
              shouldComplete = currentHour >= 23;
          }

          if (shouldComplete) {
            booking.programStatus = ProgramStatus.COMPLETED;
            updated.push(booking);
          }
        }
      }

      if (updated.length > 0) {
        await this.bookingRepository.save(updated);
        this.logger.log(`Auto-completed ${updated.length} convention booking(s)`);
      }
    } catch (error) {
      this.logger.error('Error auto-completing conventions:', error);
    }
  }

  /**
   * Update payment status to show as DUE when there's remaining payment
   * This is more of a visual indicator - runs every 6 hours
   */
  @Cron(CronExpression.EVERY_6_HOURS)
  async updatePaymentStatuses() {
    try {
      // Find bookings with remaining payment but not marked as partial/pending
      const bookingsWithDue = await this.bookingRepository.find({
        where: {
          paymentStatus: PaymentStatus.PAID,
        },
      });

      const updated = [];
      for (const booking of bookingsWithDue) {
        const remaining = booking.remainingPayment || 0;
        if (remaining > 0) {
          // Has remaining payment, should be partial
          booking.paymentStatus = booking.advancePayment > 0 
            ? PaymentStatus.PARTIAL 
            : PaymentStatus.PENDING;
          updated.push(booking);
        }
      }

      if (updated.length > 0) {
        await this.bookingRepository.save(updated);
        this.logger.log(`Updated ${updated.length} payment status(es)`);
      }
    } catch (error) {
      this.logger.error('Error updating payment statuses:', error);
    }
  }

  /**
   * Manual trigger to run both tasks immediately (useful for testing)
   */
  async runManualUpdate() {
    await this.autoCompleteConventions();
    await this.updatePaymentStatuses();
    return { message: 'Manual status update completed' };
  }
}
