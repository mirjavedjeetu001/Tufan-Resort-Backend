import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole, Permission } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll() {
    return this.userRepository.find({
      select: ['id', 'email', 'name', 'role', 'permissions', 'isActive', 'createdAt'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    return this.userRepository.findOne({
      where: { id },
      select: ['id', 'email', 'name', 'role', 'permissions', 'isActive', 'createdAt'],
    });
  }

  async create(userData: { email: string; password: string; name: string; role: UserRole; permissions?: Permission[] }) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = this.userRepository.create({
      ...userData,
      password: hashedPassword,
      permissions: userData.permissions || [],
    });
    await this.userRepository.save(user);
    const { password, ...result } = user;
    return result;
  }

  async update(id: number, userData: Partial<User>) {
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }
    await this.userRepository.update(id, userData);
    return this.findOne(id);
  }

  async delete(id: number) {
    return this.userRepository.delete(id);
  }

  async toggleActive(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error('User not found');
    }
    user.isActive = !user.isActive;
    await this.userRepository.save(user);
    const { password, ...result } = user;
    return result;
  }

  async updatePermissions(id: number, permissions: Permission[]) {
    await this.userRepository.update(id, { permissions });
    return this.findOne(id);
  }
}
