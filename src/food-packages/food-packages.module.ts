import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoodPackage } from '../entities/food-package.entity';
import { FoodPackagesController } from './food-packages.controller';
import { FoodPackagesService } from './food-packages.service';

@Module({
  imports: [TypeOrmModule.forFeature([FoodPackage])],
  controllers: [FoodPackagesController],
  providers: [FoodPackagesService],
  exports: [FoodPackagesService],
})
export class FoodPackagesModule {}
