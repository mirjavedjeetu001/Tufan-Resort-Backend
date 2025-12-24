import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ConventionHall } from './convention-hall.entity';
import { User } from './user.entity';
import { ConventionPayment } from './convention-payment.entity';

export enum ConventionBookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum ProgramStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  RUNNING = 'running',
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

  @Column({ nullable: true })
  customerNid: string;

  @Column()
  customerPhone: string;

  @Column({ nullable: true })
  customerWhatsapp: string;

  @Column({ nullable: true })
  customerEmail: string;

  @Column({ type: 'text', nullable: true })
  customerAddress: string;

  @Column({ type: 'date' })
  eventDate: Date;

  @Column({ type: 'time', nullable: true })
  startTime: string;

  @Column({ type: 'time', nullable: true })
  endTime: string;

  @Column({ nullable: true })
  timeSlot: string;

  @Column()
  eventType: string;

  @Column({ nullable: true })
  organizationName: string;

  @Column({ type: 'text', nullable: true })
  eventDescription: string;

  @Column()
  numberOfGuests: number;

  @Column({ nullable: true })
  foodPackageId: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  foodCost: number;

  @Column({ type: 'simple-json', nullable: true })
  selectedAddons: any;

  @Column({ type: 'simple-json', nullable: true })
  addonQuantities: any;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  addonsCost: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  hallRent: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discount: number;

  @Column({ type: 'enum', enum: ['flat', 'percentage'], default: 'flat' })
  discountType: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discountValue: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  vatAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  vatPercentage: number;

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

  @Column({
    type: 'enum',
    enum: ProgramStatus,
    default: ProgramStatus.PENDING,
  })
  programStatus: ProgramStatus;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @OneToMany(() => ConventionPayment, (payment) => payment.booking)
  payments: ConventionPayment[];

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
