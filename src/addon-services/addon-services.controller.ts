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
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { AddonServicesService } from './addon-services.service';
import { AddonService, ServiceCategory } from '../entities/addon-service.entity';
import { UserRole } from '../entities/user.entity';

@Controller('addon-services')
export class AddonServicesController {
  constructor(private readonly addonServicesService: AddonServicesService) {}

  @Get()
  async findAll(): Promise<AddonService[]> {
    return await this.addonServicesService.findAll();
  }

  @Get('active')
  async findActive(): Promise<AddonService[]> {
    return await this.addonServicesService.findActive();
  }

  @Get('category/:category')
  async findByCategory(@Param('category') category: ServiceCategory): Promise<AddonService[]> {
    return await this.addonServicesService.findByCategory(category);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<AddonService> {
    return await this.addonServicesService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OWNER, UserRole.STAFF)
  async create(@Body() addonServiceData: Partial<AddonService>): Promise<AddonService> {
    return await this.addonServicesService.create(addonServiceData);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OWNER, UserRole.STAFF)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() addonServiceData: Partial<AddonService>,
  ): Promise<AddonService> {
    return await this.addonServicesService.update(id, addonServiceData);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OWNER)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.addonServicesService.remove(id);
    return { message: 'Addon service deleted successfully' };
  }

  @Put(':id/toggle-active')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OWNER, UserRole.STAFF)
  async toggleActive(@Param('id', ParseIntPipe) id: number): Promise<AddonService> {
    return await this.addonServicesService.toggleActive(id);
  }

  @Post('calculate-total')
  async calculateTotal(@Body() body: { serviceIds: number[] }): Promise<{ totalCost: number }> {
    const totalCost = await this.addonServicesService.calculateTotalCost(body.serviceIds);
    return { totalCost };
  }
}
