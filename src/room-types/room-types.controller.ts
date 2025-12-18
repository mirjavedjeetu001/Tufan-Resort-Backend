import { Controller, Get, Post, Put, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { RoomTypesService } from './room-types.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../entities/user.entity';

@Controller('room-types')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RoomTypesController {
  constructor(private readonly roomTypesService: RoomTypesService) {}

  @Get()
  findAll() {
    return this.roomTypesService.findAll();
  }

  @Get('active')
  findActive() {
    return this.roomTypesService.findActive();
  }

  @Post('seed-defaults')
  @Roles(UserRole.OWNER)
  seedDefaults() {
    return this.roomTypesService.seedDefaults();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomTypesService.findOne(+id);
  }

  @Post()
  @Roles(UserRole.OWNER)
  create(@Body() createDto: any) {
    return this.roomTypesService.create(createDto);
  }

  @Put(':id')
  @Roles(UserRole.OWNER)
  update(@Param('id') id: string, @Body() updateDto: any) {
    return this.roomTypesService.update(+id, updateDto);
  }

  @Patch(':id/toggle-active')
  @Roles(UserRole.OWNER)
  toggleActive(@Param('id') id: string, @Body() body: { isActive: boolean }) {
    return this.roomTypesService.toggleActive(+id, body.isActive);
  }

  @Delete(':id')
  @Roles(UserRole.OWNER)
  remove(@Param('id') id: string) {
    return this.roomTypesService.remove(+id);
  }
}
