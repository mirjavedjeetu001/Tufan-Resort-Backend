import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Booking } from './booking.entity';

export enum UserRole {
  OWNER = 'owner',
  STAFF = 'staff',
}

export enum Permission {
  DASHBOARD_VIEW = 'dashboard.view',
  ROOMS_MANAGE = 'rooms.manage',
  BOOKINGS_MANAGE = 'bookings.manage',
  CONVENTION_MANAGE = 'convention.manage',
  CONVENTION_BOOKINGS_MANAGE = 'convention-bookings.manage',
  FOOD_PACKAGES_MANAGE = 'food-packages.manage',
  ADDON_SERVICES_MANAGE = 'addon-services.manage',
  HERO_SLIDES_MANAGE = 'hero-slides.manage',
  RESORT_SETTINGS_MANAGE = 'resort-settings.manage',
  USERS_MANAGE = 'users.manage',
  MENU_MANAGE = 'menu.manage',
  ACCESS_CONTROL_MANAGE = 'access-control.manage',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.STAFF,
  })
  role: UserRole;

  @Column({ type: 'simple-json', nullable: true })
  permissions: Permission[];

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Booking, (booking) => booking.createdBy)
  bookings: Booking[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
