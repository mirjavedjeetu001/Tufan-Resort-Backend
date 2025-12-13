import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { FoodPackagesService } from './food-packages.service';
import { FoodPackage } from '../entities/food-package.entity';
import { UserRole } from '../entities/user.entity';

@Controller('food-packages')
export class FoodPackagesController {
  constructor(private readonly foodPackagesService: FoodPackagesService) {}

  @Get()
  async findAll(): Promise<FoodPackage[]> {
    return await this.foodPackagesService.findAll();
  }

  @Get('active')
  async findActive(): Promise<FoodPackage[]> {
    return await this.foodPackagesService.findActive();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<FoodPackage> {
    return await this.foodPackagesService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OWNER, UserRole.STAFF)
  async create(@Body() foodPackageData: Partial<FoodPackage>): Promise<FoodPackage> {
    return await this.foodPackagesService.create(foodPackageData);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OWNER, UserRole.STAFF)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() foodPackageData: Partial<FoodPackage>,
  ): Promise<FoodPackage> {
    return await this.foodPackagesService.update(id, foodPackageData);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OWNER)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.foodPackagesService.remove(id);
    return { message: 'Food package deleted successfully' };
  }

  @Put(':id/toggle-active')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OWNER, UserRole.STAFF)
  async toggleActive(@Param('id', ParseIntPipe) id: number): Promise<FoodPackage> {
    return await this.foodPackagesService.toggleActive(id);
  }

  @Get(':id/calculate-cost/:guests')
  async calculateCost(
    @Param('id', ParseIntPipe) id: number,
    @Param('guests', ParseIntPipe) guests: number,
  ): Promise<{ totalCost: number }> {
    const totalCost = await this.foodPackagesService.calculateTotalCost(id, guests);
    return { totalCost };
  }
}
