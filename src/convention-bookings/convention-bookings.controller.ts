import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ConventionBookingsService } from './convention-bookings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../entities/user.entity';
import { PaymentMethod } from '../entities/convention-booking.entity';

@Controller('convention-bookings')
export class ConventionBookingsController {
  constructor(private bookingsService: ConventionBookingsService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OWNER, UserRole.STAFF)
  findAll() {
    return this.bookingsService.findAll();
  }

  @Get('by-date')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OWNER, UserRole.STAFF)
  findByDate(@Query('date') date: string) {
    return this.bookingsService.findByDate(new Date(date));
  }

  @Get('availability')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OWNER, UserRole.STAFF)
  availability(@Query('date') date: string, @Query('timeSlot') timeSlot: string) {
    return this.bookingsService.availability(new Date(date), timeSlot);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OWNER, UserRole.STAFF)
  findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(+id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OWNER, UserRole.STAFF)
  create(@Body() bookingData: any, @Request() req) {
    bookingData.createdById = req.user.userId;
    return this.bookingsService.create(bookingData);
  }

  @Post(':id/payments')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OWNER, UserRole.STAFF)
  addPayment(@Param('id') id: string, @Body() body: { amount: number; method: PaymentMethod; note?: string }) {
    return this.bookingsService.addPayment(+id, body);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OWNER, UserRole.STAFF)
  update(@Param('id') id: string, @Body() bookingData: any) {
    return this.bookingsService.update(+id, bookingData);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OWNER)
  delete(@Param('id') id: string) {
    return this.bookingsService.delete(+id);
  }
}
