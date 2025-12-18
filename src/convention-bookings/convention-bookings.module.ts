import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConventionBookingsService } from './convention-bookings.service';
import { ConventionBookingsController } from './convention-bookings.controller';
import { ConventionBookingsScheduler } from './convention-bookings.scheduler';
import { ConventionBooking } from '../entities/convention-booking.entity';
import { ConventionPayment } from '../entities/convention-payment.entity';
import { ConventionHall } from '../entities/convention-hall.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ConventionBooking, ConventionPayment, ConventionHall])],
  providers: [ConventionBookingsService, ConventionBookingsScheduler],
  controllers: [ConventionBookingsController],
  exports: [ConventionBookingsService],
})
export class ConventionBookingsModule {}
