import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Booking } from './booking.entity';

export enum RoomType {
  STANDARD = 'standard',
  DELUXE = 'deluxe',
  SUITE = 'suite',
  FAMILY = 'family',
}

export enum RoomStatus {
  AVAILABLE = 'available',
  BOOKED = 'booked',
  MAINTENANCE = 'maintenance',
}

@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  roomNumber: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: RoomType,
  })
  type: RoomType;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  pricePerNight: number;

  @Column({ nullable: true })
  maxGuests: number;

  @Column({ nullable: true })
  numberOfBeds: number;

  @Column({ type: 'simple-array', nullable: true })
  amenities: string[];

  @Column({ type: 'simple-array', nullable: true })
  images: string[];

  @Column({
    type: 'enum',
    enum: RoomStatus,
    default: RoomStatus.AVAILABLE,
  })
  status: RoomStatus;

  @OneToMany(() => Booking, (booking) => booking.room)
  bookings: Booking[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
