import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ConventionHallService } from './convention-hall.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../entities/user.entity';

@Controller('convention-hall')
export class ConventionHallController {
  constructor(private hallService: ConventionHallService) {}

  @Get()
  findAll() {
    return this.hallService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.hallService.findOne(+id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OWNER, UserRole.STAFF)
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: './uploads/convention',
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
  async create(@Body() hallData: any, @UploadedFiles() files: Express.Multer.File[]) {
    if (files && files.length > 0) {
      hallData.images = files.map((file) => `/uploads/convention/${file.filename}`);
    }
    if (typeof hallData.amenities === 'string') {
      hallData.amenities = hallData.amenities.split(',').map((a) => a.trim());
    }
    if (typeof hallData.eventTypes === 'string') {
      hallData.eventTypes = hallData.eventTypes.split(',').map((a) => a.trim());
    }
    if (typeof hallData.timeSlots === 'string') {
      hallData.timeSlots = hallData.timeSlots.split(',').map((a) => a.trim());
    }
    return this.hallService.create(hallData);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OWNER, UserRole.STAFF)
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: './uploads/convention',
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
    @Body() hallData: any,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    // Remove invalid fields that might come from old data
    delete hallData.capacity;
    
    if (files && files.length > 0) {
      const newImages = files.map((file) => `/uploads/convention/${file.filename}`);
      hallData.images = hallData.images
        ? [...(Array.isArray(hallData.images) ? hallData.images : []), ...newImages]
        : newImages;
    }
    if (typeof hallData.amenities === 'string') {
      hallData.amenities = hallData.amenities.split(',').map((a) => a.trim());
    }
    if (typeof hallData.eventTypes === 'string') {
      hallData.eventTypes = hallData.eventTypes.split(',').map((a) => a.trim());
    }
    if (typeof hallData.timeSlots === 'string') {
      hallData.timeSlots = hallData.timeSlots.split(',').map((a) => a.trim());
    }
    return this.hallService.update(+id, hallData);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OWNER)
  delete(@Param('id') id: string) {
    return this.hallService.delete(+id);
  }
}
