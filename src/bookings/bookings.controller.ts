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
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { BookingsService } from './bookings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../entities/user.entity';

@Controller('bookings')
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OWNER, UserRole.STAFF)
  findAll() {
    return this.bookingsService.findAll();
  }

  @Get('metrics')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OWNER, UserRole.STAFF)
  getMetrics() {
    return this.bookingsService.getMetrics();
  }

  @Get('customer/:phone')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OWNER, UserRole.STAFF)
  findByPhone(@Param('phone') phone: string) {
    return this.bookingsService.findByPhone(phone);
  }

  @Get('date-range')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OWNER, UserRole.STAFF)
  findByDateRange(@Query('start') start: string, @Query('end') end: string) {
    return this.bookingsService.findByDateRange(new Date(start), new Date(end));
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
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'customerPhoto', maxCount: 1 },
        { name: 'customerNidDocument', maxCount: 1 },
        { name: 'passportDocument', maxCount: 1 },
        { name: 'visitingCard', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: './uploads/bookings',
          filename: (req, file, cb) => {
            const randomName = Array(32)
              .fill(null)
              .map(() => Math.round(Math.random() * 16).toString(16))
              .join('');
            cb(null, `${randomName}${extname(file.originalname)}`);
          },
        }),
        limits: {
          fileSize: 10 * 1024 * 1024, // 10MB limit per file
        },
        fileFilter: (req, file, cb) => {
          // Allow images and PDFs
          const allowedTypes = /jpeg|jpg|png|gif|pdf|webp/;
          const mimetype = allowedTypes.test(file.mimetype);
          const extname = allowedTypes.test(file.originalname.toLowerCase());
          
          if (mimetype && extname) {
            return cb(null, true);
          }
          cb(new Error('Only image and PDF files are allowed!'), false);
        },
      },
    ),
  )
  create(
    @Body() bookingData: any,
    @UploadedFiles() files: { 
      customerPhoto?: Express.Multer.File[]; 
      customerNidDocument?: Express.Multer.File[];
      passportDocument?: Express.Multer.File[];
      visitingCard?: Express.Multer.File[];
    },
    @Request() req,
  ) {
    if (files?.customerPhoto) {
      bookingData.customerPhoto = `/uploads/bookings/${files.customerPhoto[0].filename}`;
    }
    if (files?.customerNidDocument) {
      bookingData.customerNidDocument = `/uploads/bookings/${files.customerNidDocument[0].filename}`;
    }
    if (files?.passportDocument) {
      bookingData.passportDocument = `/uploads/bookings/${files.passportDocument[0].filename}`;
    }
    if (files?.visitingCard) {
      bookingData.visitingCard = `/uploads/bookings/${files.visitingCard[0].filename}`;
    }
    
    // Parse JSON fields if they exist
    if (bookingData.additionalGuests && typeof bookingData.additionalGuests === 'string') {
      bookingData.additionalGuests = JSON.parse(bookingData.additionalGuests);
    }
    
    // Convert numeric fields from strings
    bookingData.roomId = parseInt(bookingData.roomId);
    bookingData.numberOfGuests = parseInt(bookingData.numberOfGuests);
    bookingData.totalAmount = parseFloat(bookingData.totalAmount);
    bookingData.advancePayment = parseFloat(bookingData.advancePayment);
    bookingData.remainingPayment = parseFloat(bookingData.remainingPayment);
    bookingData.extraCharges = parseFloat(bookingData.extraCharges || 0);
    bookingData.discountPercentage = parseFloat(bookingData.discountPercentage || 0);
    bookingData.discountAmount = parseFloat(bookingData.discountAmount || 0);
    
    bookingData.createdById = req.user.userId;
    return this.bookingsService.create(bookingData);
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
