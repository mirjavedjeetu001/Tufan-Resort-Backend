import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Room } from './room.entity';
import { User } from './user.entity';

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CHECKED_IN = 'checked_in',
  CHECKED_OUT = 'checked_out',
  CANCELLED = 'cancelled',
}

export enum PaymentMethod {
  CASH = 'cash',
  CARD = 'card',
  MFS = 'mfs',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PARTIAL = 'partial',
  PAID = 'paid',
  REFUNDED = 'refunded',
}

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Room, (room) => room.bookings)
  @JoinColumn({ name: 'roomId' })
  room: Room;

  @Column()
  roomId: number;

  @Column()
  customerName: string;

  @Column()
  customerNid: string;

  @Column({ nullable: true })
  customerPhoto: string;

  @Column({ nullable: true })
  customerNidDocument: string;

  @Column({ nullable: true })
  passportNumber: string;

  @Column({ nullable: true })
  passportDocument: string;

  @Column({ nullable: true })
  visitingCard: string;

  @Column()
  customerPhone: string;

  @Column({ nullable: true })
  referenceName: string;

  @Column({ nullable: true })
  referencePhone: string;

  @Column({ nullable: true })
  customerWhatsapp: string;

  @Column()
  customerEmail: string;

  @Column({ type: 'text', nullable: true })
  customerAddress: string;

  @Column({ type: 'date' })
  checkInDate: Date;

  @Column({ type: 'time', nullable: true })
  checkInTime: string;

  @Column({ type: 'date' })
  checkOutDate: Date;

  @Column({ type: 'time', nullable: true })
  checkOutTime: string;

  @Column()
  numberOfGuests: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  advancePayment: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  remainingPayment: number;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
  })
  paymentMethod: PaymentMethod;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  paymentStatus: PaymentStatus;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  status: BookingStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  extraCharges: number;

  @Column({ type: 'text', nullable: true })
  extraChargesDescription: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discountAmount: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  discountPercentage: number;

  @Column({ type: 'enum', enum: ['none', 'percentage', 'flat'], default: 'none' })
  discountType: string;

  @Column({ nullable: true })
  foodPackageId: number;

  @Column({ default: 0 })
  foodPackageGuests: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  foodPackageCost: number;

  @Column({ type: 'simple-json', nullable: true })
  selectedAddons: any;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  addonsCost: number;

  @Column({ type: 'simple-json', nullable: true })
  extras: any;

  @Column({ type: 'simple-json', nullable: true })
  additionalGuests: any;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ default: 'ac' })
  acPreference: string;

  @Column({ default: false })
  vatEnabled: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  vatAmount: number;

  @ManyToOne(() => User, (user) => user.bookings)
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @Column()
  createdById: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
