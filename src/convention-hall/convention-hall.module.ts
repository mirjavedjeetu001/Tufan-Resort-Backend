import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConventionHallService } from './convention-hall.service';
import { ConventionHallController } from './convention-hall.controller';
import { ConventionHall } from '../entities/convention-hall.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ConventionHall])],
  providers: [ConventionHallService],
  controllers: [ConventionHallController],
  exports: [ConventionHallService],
})
export class ConventionHallModule {}
