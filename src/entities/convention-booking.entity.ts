import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ConventionHall } from './convention-hall.entity';
import { User } from './user.entity';

export enum ConventionBookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
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

@Entity('convention_bookings')
export class ConventionBooking {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ConventionHall, (hall) => hall.bookings)
  @JoinColumn({ name: 'hallId' })
  hall: ConventionHall;

  @Column()
  hallId: number;

  @Column()
  customerName: string;

  @Column()
  customerNid: string;

  @Column()
  customerPhone: string;

  @Column({ nullable: true })
  customerWhatsapp: string;

  @Column()
  customerEmail: string;

  @Column({ type: 'text', nullable: true })
  customerAddress: string;

  @Column({ type: 'date' })
  eventDate: Date;

  @Column()
  timeSlot: string;

  @Column()
  eventType: string;

  @Column()
  numberOfGuests: number;

  @Column({ type: 'simple-array', nullable: true })
  addOns: string[];

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
    enum: ConventionBookingStatus,
    default: ConventionBookingStatus.PENDING,
  })
  status: ConventionBookingStatus;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @Column()
  createdById: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
