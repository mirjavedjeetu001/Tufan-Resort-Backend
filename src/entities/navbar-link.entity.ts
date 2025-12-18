import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';

@Entity('navbar_links')
export class NavbarLink {
  @PrimaryGeneratedColumn()
  id: number;

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

  @Column({ nullable: true })
  parentId: number;

  @ManyToOne(() => NavbarLink, link => link.children, { nullable: true })
  @JoinColumn({ name: 'parentId' })
  parent: NavbarLink;

  @OneToMany(() => NavbarLink, link => link.parent)
  children: NavbarLink[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
