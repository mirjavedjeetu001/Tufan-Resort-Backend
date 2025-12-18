import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { FooterService } from './footer.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../entities/user.entity';

@Controller('footer')
export class FooterController {
  constructor(private footerService: FooterService) {}

  @Get('sections')
  findAllSections() {
    return this.footerService.findAllSections();
  }

  @Get('sections/active')
  findActiveSections() {
    return this.footerService.findActiveSections();
  }

  @Post('sections')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OWNER)
  createSection(@Body() data: any) {
    return this.footerService.createSection(data);
  }

  @Put('sections/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OWNER)
  updateSection(@Param('id') id: string, @Body() data: any) {
    return this.footerService.updateSection(+id, data);
  }

  @Delete('sections/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OWNER)
  deleteSection(@Param('id') id: string) {
    return this.footerService.deleteSection(+id);
  }

  @Post('links')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OWNER)
  createLink(@Body() data: any) {
    return this.footerService.createLink(data);
  }

  @Put('links/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OWNER)
  updateLink(@Param('id') id: string, @Body() data: any) {
    return this.footerService.updateLink(+id, data);
  }

  @Delete('links/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OWNER)
  deleteLink(@Param('id') id: string) {
    return this.footerService.deleteLink(+id);
  }
}
