import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('resort_info')
export class ResortInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  aboutText: string;

  @Column({ type: 'text', nullable: true })
  missionText: string;

  @Column()
  address: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  mapEmbedUrl: string;

  @Column({ type: 'simple-json', nullable: true })
  socialLinks: any;

  @Column({ type: 'simple-array', nullable: true })
  facilities: string[];

  @Column({ default: false })
  vatEnabled: boolean;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  vatPercentage: number;

  @Column({ type: 'enum', enum: ['fixed', 'automatic'], default: 'automatic', nullable: false })
  checkInCheckOutMode: string;

  @Column({ nullable: true })
  defaultCheckInTime: string;

  @Column({ nullable: true })
  defaultCheckOutTime: string;

  @UpdateDateColumn()
  updatedAt: Date;
}
