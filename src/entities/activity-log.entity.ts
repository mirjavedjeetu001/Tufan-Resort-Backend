import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('activity_logs')
export class ActivityLog {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true })
  userId: number;

  @Column()
  userName: string;

  @Column()
  userEmail: string;

  @Column()
  action: string; // create, update, delete, login, logout

  @Column()
  entityType: string; // room, booking, user, convention-hall, hero-slide, resort-info

  @Column({ nullable: true })
  entityId: number;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'json', nullable: true })
  changes: any; // Store before/after values

  @Column({ nullable: true })
  ipAddress: string;

  @CreateDateColumn()
  createdAt: Date;
}
