import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserRole, Permission } from '../entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { email, isActive: true } });
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role, permissions: user.permissions || [] };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        permissions: user.permissions || [],
      },
    };
  }

  async register(
    email: string,
    password: string,
    name: string,
    role: UserRole = UserRole.STAFF,
    permissions: Permission[] = [],
  ) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      name,
      role,
      permissions,
    });
    await this.userRepository.save(user);
    const { password: _, ...result } = user;
    return result;
  }

  async hasAnyUser() {
    const count = await this.userRepository.count();
    return count > 0;
  }

  async findById(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }
}
