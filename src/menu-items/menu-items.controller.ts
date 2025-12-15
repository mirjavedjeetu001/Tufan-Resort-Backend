import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { MenuItemsService } from './menu-items.service';
import { MenuItem } from '../entities/menu-item.entity';

@Controller('menu-items')
@UseGuards(JwtAuthGuard)
export class MenuItemsController {
  constructor(private readonly menuItemsService: MenuItemsService) {}

  @Get()
  findAll() {
    return this.menuItemsService.findAll();
  }

  @Get('active')
  findActive(@Request() req) {
    return this.menuItemsService.findActive(req.user.role);
  }

  @Get('seed')
  @UseGuards(RolesGuard)
  @Roles('owner')
  seedDefaultMenus() {
    return this.menuItemsService.seedDefaultMenus();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.menuItemsService.findOne(+id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('owner')
  create(@Body() menuItemData: Partial<MenuItem>) {
    return this.menuItemsService.create(menuItemData);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles('owner')
  update(@Param('id') id: string, @Body() menuItemData: Partial<MenuItem>) {
    return this.menuItemsService.update(+id, menuItemData);
  }

  @Put(':id/toggle')
  @UseGuards(RolesGuard)
  @Roles('owner')
  toggleActive(@Param('id') id: string) {
    return this.menuItemsService.toggleActive(+id);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('owner')
  delete(@Param('id') id: string) {
    return this.menuItemsService.delete(+id);
  }
}
