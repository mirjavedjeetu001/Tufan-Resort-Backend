import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConventionBookingsService } from './convention-bookings.service';
import { ConventionBookingsController } from './convention-bookings.controller';
import { ConventionBooking } from '../entities/convention-booking.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ConventionBooking])],
  providers: [ConventionBookingsService],
  controllers: [ConventionBookingsController],
  exports: [ConventionBookingsService],
})
export class ConventionBookingsModule {}
