import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuItem } from '../entities/menu-item.entity';

@Injectable()
export class MenuItemsService {
  constructor(
    @InjectRepository(MenuItem)
    private menuItemsRepository: Repository<MenuItem>,
  ) {}

  async findAll(): Promise<MenuItem[]> {
    return this.menuItemsRepository.find({
      order: { order: 'ASC', name: 'ASC' },
    });
  }

  async findActive(userRole: string): Promise<MenuItem[]> {
    const query = this.menuItemsRepository.createQueryBuilder('menu');
    
    query.where('menu.isActive = :isActive', { isActive: true });
    
    // Filter by role hierarchy: owner sees all, staff sees staff and public
    if (userRole === 'staff') {
      query.andWhere('menu.requiredRole IN (:...roles)', { roles: ['staff', 'public'] });
    } else if (userRole !== 'owner') {
      query.andWhere('menu.requiredRole = :role', { role: 'public' });
    }
    
    query.orderBy('menu.order', 'ASC').addOrderBy('menu.name', 'ASC');
    
    return query.getMany();
  }

  async findOne(id: number): Promise<MenuItem> {
    const menuItem = await this.menuItemsRepository.findOne({ where: { id } });
    if (!menuItem) {
      throw new NotFoundException(`Menu item with ID ${id} not found`);
    }
    return menuItem;
  }

  async create(menuItemData: Partial<MenuItem>): Promise<MenuItem> {
    const menuItem = this.menuItemsRepository.create(menuItemData);
    return this.menuItemsRepository.save(menuItem);
  }

  async update(id: number, menuItemData: Partial<MenuItem>): Promise<MenuItem> {
    await this.findOne(id);
    await this.menuItemsRepository.update(id, menuItemData);
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    const menuItem = await this.findOne(id);
    await this.menuItemsRepository.remove(menuItem);
  }

  async toggleActive(id: number): Promise<MenuItem> {
    const menuItem = await this.findOne(id);
    menuItem.isActive = !menuItem.isActive;
    return this.menuItemsRepository.save(menuItem);
  }

  async seedDefaultMenus(): Promise<void> {
    const count = await this.menuItemsRepository.count();
    if (count > 0) return;

    const defaultMenus = [
      { name: 'Dashboard', path: '/admin/dashboard', icon: '📊', order: 1, requiredRole: 'staff', description: 'Main dashboard with analytics' },
      { name: 'Rooms', path: '/admin/dashboard/rooms', icon: '🛏️', order: 2, requiredRole: 'staff', description: 'Manage rooms inventory' },
      { name: 'Bookings', path: '/admin/dashboard/bookings', icon: '📅', order: 3, requiredRole: 'staff', description: 'Manage room bookings' },
      { name: 'Premium Booking', path: '/admin/dashboard/premium-booking', icon: '⭐', order: 4, requiredRole: 'staff', description: 'Create premium bookings' },
      { name: 'Convention Hall', path: '/admin/dashboard/convention', icon: '🏛️', order: 5, requiredRole: 'staff', description: 'Manage convention halls' },
      { name: 'Hero Slides', path: '/admin/dashboard/hero-slides', icon: '🎨', order: 6, requiredRole: 'owner', description: 'Manage homepage carousel' },
      { name: 'Resort Settings', path: '/admin/dashboard/settings', icon: '⚙️', order: 7, requiredRole: 'owner', description: 'Resort information settings' },
      { name: 'User Management', path: '/admin/dashboard/users', icon: '👥', order: 8, requiredRole: 'owner', description: 'Manage admin users' },
      { name: 'Menu Management', path: '/admin/dashboard/menus', icon: '📋', order: 9, requiredRole: 'owner', description: 'Control menu visibility' },
    ];

    await this.menuItemsRepository.save(defaultMenus);
  }
}
