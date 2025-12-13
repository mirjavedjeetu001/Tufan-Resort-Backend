import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { ConventionBooking, PaymentMethod } from './convention-booking.entity';

@Entity('convention_payments')
export class ConventionPayment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ConventionBooking, (booking) => booking.payments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bookingId' })
  booking: ConventionBooking;

  @Column()
  bookingId: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: ['cash', 'card', 'mfs'],
  })
  method: PaymentMethod;

  @Column({ type: 'text', nullable: true })
  note: string;

  @CreateDateColumn()
  createdAt: Date;
}
