import { Controller, Get, Post, Body } from '@nestjs/common';
import { SystemSettingsService } from './system-settings.service';

@Controller('system')
export class SystemSettingsController {
  constructor(private systemSettingsService: SystemSettingsService) {}

  @Get('install-status')
  async getInstallStatus() {
    const isInstalled = await this.systemSettingsService.isSystemInstalled();
    return { installed: isInstalled };
  }

  @Post('install')
  async install(@Body() installData: {
    name: string;
    email: string;
    password: string;
    resortName: string;
    resortTagline: string;
  }) {
    return this.systemSettingsService.installSystem(installData);
  }

  @Get('settings')
  async getAllSettings() {
    return this.systemSettingsService.getAllSettings();
  }
}
