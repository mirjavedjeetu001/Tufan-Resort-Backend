import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Permission, UserRole } from '../entities/user.entity';
import { PERMISSIONS_KEY } from './permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user) return false;

    if (user.role === UserRole.OWNER) {
      return true; // owners bypass
    }

    const userPermissions: Permission[] = user.permissions || [];
    return requiredPermissions.every((perm) => userPermissions.includes(perm));
  }
}
