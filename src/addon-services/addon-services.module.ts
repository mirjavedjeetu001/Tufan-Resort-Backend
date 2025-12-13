import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddonService } from '../entities/addon-service.entity';
import { AddonServicesController } from './addon-services.controller';
import { AddonServicesService } from './addon-services.service';

@Module({
  imports: [TypeOrmModule.forFeature([AddonService])],
  controllers: [AddonServicesController],
  providers: [AddonServicesService],
  exports: [AddonServicesService],
})
export class AddonServicesModule {}
