import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FooterSection } from '../entities/footer-section.entity';
import { FooterLink } from '../entities/footer-link.entity';
import { FooterController } from './footer.controller';
import { FooterService } from './footer.service';

@Module({
  imports: [TypeOrmModule.forFeature([FooterSection, FooterLink])],
  controllers: [FooterController],
  providers: [FooterService],
  exports: [FooterService],
})
export class FooterModule {}
