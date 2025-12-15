import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('menu_items')
export class MenuItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 200 })
  path: string;

  @Column({ length: 50, nullable: true })
  icon: string;

  @Column({ type: 'int', default: 0 })
  order: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ length: 50, default: 'staff' })
  requiredRole: string; // 'owner', 'staff', 'public'

  @Column({ length: 200, nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
