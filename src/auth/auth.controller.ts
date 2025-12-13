import { Controller, Post, Body, UnauthorizedException, HttpCode, HttpStatus, Req, ForbiddenException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';
import { UserRole } from '../entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private jwtService: JwtService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: { email: string; password: string }) {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @Post('register')
  async register(
    @Body() registerDto: { email: string; password: string; name: string; role?: string; permissions?: string[] },
    @Req() req: any,
  ) {
    const hasUser = await this.authService.hasAnyUser();
    if (hasUser) {
      const authHeader = req.headers?.authorization || '';
      const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
      let requesterRole = null;
      try {
        if (token) {
          const decoded: any = this.jwtService.verify(token, {
            secret: process.env.JWT_SECRET || 'your_jwt_secret_key_change_in_production',
          });
          requesterRole = decoded?.role;
        }
      } catch (error) {
        requesterRole = null;
      }

      if (requesterRole !== UserRole.OWNER) {
        throw new ForbiddenException('Only owner can register new users');
      }
    }

    return this.authService.register(
      registerDto.email,
      registerDto.password,
      registerDto.name,
      registerDto.role as any,
      registerDto.permissions as any,
    );
  }
}
