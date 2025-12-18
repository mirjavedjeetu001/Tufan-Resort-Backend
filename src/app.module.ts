import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ScheduleModule } from '@nestjs/schedule';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RoomsModule } from './rooms/rooms.module';
import { BookingsModule } from './bookings/bookings.module';
import { ConventionHallModule } from './convention-hall/convention-hall.module';
import { ConventionBookingsModule } from './convention-bookings/convention-bookings.module';
import { HeroSlidesModule } from './hero-slides/hero-slides.module';
import { ResortInfoModule } from './resort-info/resort-info.module';
import { FoodPackagesModule } from './food-packages/food-packages.module';
import { AddonServicesModule } from './addon-services/addon-services.module';
import { MenuItemsModule } from './menu-items/menu-items.module';
import { RoomTypesModule } from './room-types/room-types.module';
import { User } from './entities/user.entity';
import { Room } from './entities/room.entity';
import { Booking } from './entities/booking.entity';
import { ConventionHall } from './entities/convention-hall.entity';
import { ConventionBooking } from './entities/convention-booking.entity';
import { ConventionPayment } from './entities/convention-payment.entity';
import { HeroSlide } from './entities/hero-slide.entity';
import { ResortInfo } from './entities/resort-info.entity';
import { FoodPackage } from './entities/food-package.entity';
import { AddonService } from './entities/addon-service.entity';
import { MenuItem } from './entities/menu-item.entity';
import { RoomTypeEntity } from './entities/room-type.entity';
import { SystemSetting } from './entities/system-setting.entity';
import { NavbarLink } from './entities/navbar-link.entity';
import { FooterSection } from './entities/footer-section.entity';
import { FooterLink } from './entities/footer-link.entity';
import { SystemSettingsModule } from './system-settings/system-settings.module';
import { NavbarModule } from './navbar/navbar.module';
import { FooterModule } from './footer/footer.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DATABASE_HOST'),
        port: +configService.get('DATABASE_PORT'),
        username: configService.get('DATABASE_USER'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        entities: [User, Room, Booking, ConventionHall, ConventionBooking, ConventionPayment, HeroSlide, ResortInfo, FoodPackage, AddonService, MenuItem, RoomTypeEntity, SystemSetting, NavbarLink, FooterSection, FooterLink],
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
    FoodPackagesModule,
    AddonServicesModule,
    MenuItemsModule,
    RoomTypesModule,
    SystemSettingsModule,
    NavbarModule,
    FooterModule,
  ],
})
export class AppModule {}
