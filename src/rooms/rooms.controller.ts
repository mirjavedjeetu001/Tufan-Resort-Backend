import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { RoomsService } from './rooms.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../entities/user.entity';

@Controller('rooms')
export class RoomsController {
  constructor(private roomsService: RoomsService) {}

  @Get()
  findAll() {
    return this.roomsService.findAll();
  }

  @Get('available')
  findAvailable(@Query('checkIn') checkIn?: string, @Query('checkOut') checkOut?: string) {
    if (checkIn && checkOut) {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      return this.roomsService.findAvailableByDate(checkInDate, checkOutDate);
    }
    return this.roomsService.findAvailable();
  }

  @Get('search')
  searchRooms(@Query('q') query: string) {
    return this.roomsService.searchRooms(query);
  }

  @Get('by-room-number/:roomNumber')
  findByRoomNumber(@Param('roomNumber') roomNumber: string) {
    return this.roomsService.findByRoomNumber(roomNumber);
  }

  @Get('check-availability/:roomNumber')
  checkRoomAvailability(
    @Param('roomNumber') roomNumber: string,
    @Query('checkIn') checkIn: string,
    @Query('checkOut') checkOut: string,
  ) {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    return this.roomsService.checkRoomAvailability(roomNumber, checkInDate, checkOutDate);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomsService.findOne(+id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OWNER, UserRole.STAFF)
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: './uploads/rooms',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async create(@Body() roomData: any, @UploadedFiles() files: Express.Multer.File[]) {
    if (files && files.length > 0) {
      roomData.images = files.map((file) => `/uploads/rooms/${file.filename}`);
    }
    if (typeof roomData.amenities === 'string') {
      roomData.amenities = roomData.amenities.split(',').map((a) => a.trim());
    }
    return this.roomsService.create(roomData);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OWNER, UserRole.STAFF)
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: './uploads/rooms',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async update(
    @Param('id') id: string,
    @Body() roomData: any,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    if (files && files.length > 0) {
      const newImages = files.map((file) => `/uploads/rooms/${file.filename}`);
      roomData.images = roomData.images
        ? [...(Array.isArray(roomData.images) ? roomData.images : []), ...newImages]
        : newImages;
    }
    if (typeof roomData.amenities === 'string') {
      roomData.amenities = roomData.amenities.split(',').map((a) => a.trim());
    }
    return this.roomsService.update(+id, roomData);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OWNER)
  delete(@Param('id') id: string) {
    return this.roomsService.delete(+id);
  }
}
