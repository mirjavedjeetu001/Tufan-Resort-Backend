import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemSetting } from '../entities/system-setting.entity';
import { User, UserRole } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SystemSettingsService {
  constructor(
    @InjectRepository(SystemSetting)
    private settingsRepository: Repository<SystemSetting>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async isSystemInstalled(): Promise<boolean> {
    const setting = await this.settingsRepository.findOne({
      where: { settingKey: 'system_installed' },
    });
    return setting && setting.settingValue === 'true';
  }

  async installSystem(adminData: {
    name: string;
    email: string;
    password: string;
    resortName: string;
    resortTagline: string;
  }): Promise<{ success: boolean; message: string }> {
    const isInstalled = await this.isSystemInstalled();
    
    if (isInstalled) {
      return { success: false, message: 'System is already installed' };
    }

    try {
      // Create super admin user
      const hashedPassword = await bcrypt.hash(adminData.password, 10);
      const admin = this.userRepository.create({
        name: adminData.name,
        email: adminData.email,
        password: hashedPassword,
        role: UserRole.OWNER,
        isActive: true,
        permissions: [], // Full access
      });
      await this.userRepository.save(admin);

      // Mark system as installed
      await this.settingsRepository.update(
        { settingKey: 'system_installed' },
        { settingValue: 'true' },
      );

      // Set resort name and tagline if provided
      if (adminData.resortName) {
        await this.setSetting('resort_name', adminData.resortName);
      }
      if (adminData.resortTagline) {
        await this.setSetting('resort_tagline', adminData.resortTagline);
      }

      return { success: true, message: 'System installed successfully' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async getSetting(key: string): Promise<string | null> {
    const setting = await this.settingsRepository.findOne({
      where: { settingKey: key },
    });
    return setting ? setting.settingValue : null;
  }

  async setSetting(key: string, value: string): Promise<void> {
    const existing = await this.settingsRepository.findOne({
      where: { settingKey: key },
    });

    if (existing) {
      await this.settingsRepository.update({ settingKey: key }, { settingValue: value });
    } else {
      const setting = this.settingsRepository.create({ settingKey: key, settingValue: value });
      await this.settingsRepository.save(setting);
    }
  }

  async getAllSettings(): Promise<Record<string, string>> {
    const settings = await this.settingsRepository.find();
    const result: Record<string, string> = {};
    settings.forEach(setting => {
      result[setting.settingKey] = setting.settingValue;
    });
    return result;
  }
}
