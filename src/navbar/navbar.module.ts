import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NavbarLink } from '../entities/navbar-link.entity';
import { NavbarController } from './navbar.controller';
import { NavbarService } from './navbar.service';

@Module({
  imports: [TypeOrmModule.forFeature([NavbarLink])],
  controllers: [NavbarController],
  providers: [NavbarService],
  exports: [NavbarService],
})
export class NavbarModule {}
