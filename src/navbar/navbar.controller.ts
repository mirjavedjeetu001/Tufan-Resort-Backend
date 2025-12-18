import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { NavbarService } from './navbar.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../entities/user.entity';

@Controller('navbar')
export class NavbarController {
  constructor(private navbarService: NavbarService) {}

  @Get()
  findAll() {
    return this.navbarService.findAll();
  }

  @Get('active')
  findActive() {
    return this.navbarService.findActive();
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OWNER)
  create(@Body() data: any) {
    return this.navbarService.create(data);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OWNER)
  update(@Param('id') id: string, @Body() data: any) {
    return this.navbarService.update(+id, data);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OWNER)
  delete(@Param('id') id: string) {
    return this.navbarService.delete(+id);
  }
}
