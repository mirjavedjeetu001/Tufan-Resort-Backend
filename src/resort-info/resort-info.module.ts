import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResortInfoService } from './resort-info.service';
import { ResortInfoController } from './resort-info.controller';
import { ResortInfo } from '../entities/resort-info.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ResortInfo])],
  providers: [ResortInfoService],
  controllers: [ResortInfoController],
  exports: [ResortInfoService],
})
export class ResortInfoModule {}
