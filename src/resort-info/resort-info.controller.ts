import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { ResortInfoService } from './resort-info.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../entities/user.entity';

@Controller('resort-info')
export class ResortInfoController {
  constructor(private infoService: ResortInfoService) {}

  @Get()
  get() {
    return this.infoService.get();
  }

  @Put()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OWNER, UserRole.STAFF)
  update(@Body() infoData: any) {
    return this.infoService.update(infoData);
  }
}
