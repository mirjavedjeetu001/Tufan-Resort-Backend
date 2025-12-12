import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RoomsModule } from './rooms/rooms.module';
import { BookingsModule } from './bookings/bookings.module';
import { ConventionHallModule } from './convention-hall/convention-hall.module';
import { ConventionBookingsModule } from './convention-bookings/convention-bookings.module';
import { HeroSlidesModule } from './hero-slides/hero-slides.module';
import { ResortInfoModule } from './resort-info/resort-info.module';
import { User } from './entities/user.entity';
import { Room } from './entities/room.entity';
import { Booking } from './entities/booking.entity';
import { ConventionHall } from './entities/convention-hall.entity';
import { ConventionBooking } from './entities/convention-booking.entity';
import { HeroSlide } from './entities/hero-slide.entity';
import { ResortInfo } from './entities/resort-info.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DATABASE_HOST'),
        port: +configService.get('DATABASE_PORT'),
        username: configService.get('DATABASE_USER'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        entities: [User, Room, Booking, ConventionHall, ConventionBooking, HeroSlide, ResortInfo],
        synchronize: true, // Set to false in production
      }),
      inject: [ConfigService],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    AuthModule,
    UsersModule,
    RoomsModule,
    BookingsModule,
    ConventionHallModule,
    ConventionBookingsModule,
    HeroSlidesModule,
    ResortInfoModule,
  ],
})
export class AppModule {}
