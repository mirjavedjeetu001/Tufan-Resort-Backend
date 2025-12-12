import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ConventionBooking } from './convention-booking.entity';

@Entity('convention_hall')
export class ConventionHall {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  dimensions: number; // in sq ft

  @Column()
  maxCapacity: number;

  @Column({ type: 'simple-array' })
  amenities: string[];

  @Column({ type: 'simple-array', nullable: true })
  images: string[];

  @Column({ type: 'simple-array' })
  eventTypes: string[];

  @Column({ type: 'simple-array' })
  timeSlots: string[];

  @OneToMany(() => ConventionBooking, (booking) => booking.hall)
  bookings: ConventionBooking[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
