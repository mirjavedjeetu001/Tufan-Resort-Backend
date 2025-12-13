import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConventionBookingsService } from './convention-bookings.service';
import { ConventionBookingsController } from './convention-bookings.controller';
import { ConventionBooking } from '../entities/convention-booking.entity';
import { ConventionPayment } from '../entities/convention-payment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ConventionBooking, ConventionPayment])],
  providers: [ConventionBookingsService],
  controllers: [ConventionBookingsController],
  exports: [ConventionBookingsService],
})
export class ConventionBookingsModule {}
