import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { FooterSection } from './footer-section.entity';

@Entity('footer_links')
export class FooterLink {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sectionId: number;

  @Column()
  label: string;

  @Column()
  url: string;

  @Column({ default: 0 })
  displayOrder: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  openInNewTab: boolean;

  @ManyToOne(() => FooterSection, section => section.links)
  @JoinColumn({ name: 'sectionId' })
  section: FooterSection;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
