import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum ServiceCategory {
  DECORATION = 'decoration',
  SOUND_SYSTEM = 'sound_system',
  PHOTOGRAPHY = 'photography',
  CATERING = 'catering',
  TRANSPORT = 'transport',
  OTHER = 'other',
}

@Entity('addon_services')
export class AddonService {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: ServiceCategory,
    default: ServiceCategory.OTHER,
  })
  category: ServiceCategory;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
