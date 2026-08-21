import { Injectable, UnauthorizedException, BadRequestException, ConflictException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
/**
 * خدمة المصادقة (Auth Service)
 * 
 * تدير عمليات التسجيل، تسجيل الدخول، إنشاء رموز التوثيق (JWT Tokens)
 * وتشفير كلمات المرور (Hashing).
 */
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const email = `${dto.phone}@haretna.com`; // استخدام رقم الهاتف كمعرف أساسي لإنشاء إيميل وهمي للتعامل مع متطلبات النظام

    const existingUser = await this.prisma.user.findUnique({
      where: { phone: dto.phone },
    });
    
    if (existingUser) {
      throw new ConflictException('User with this phone number already exists.');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(dto.password, salt);

    const user = await this.prisma.user.create({
      data: {
        email,
        phone: dto.phone,
        passwordHash,
        name: dto.name,
        city: dto.city,
        neighborhood: dto.neighborhood,
      },
    });

    const payload = { sub: user.id, email: user.email, phone: user.phone };
    const token = this.jwtService.sign(payload);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _, ...userProfile } = user;
    return { token, user: userProfile };
  }

  async login(dto: LoginDto) {
    const email = `${dto.phone}@haretna.com`;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // التحقق من مطابقة كلمة المرور المدخلة مع الكلمة المشفرة في قاعدة البيانات
    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email, phone: user.phone };
    const token = this.jwtService.sign(payload);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _, ...userProfile } = user;
    return { token, user: userProfile };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        _count: {
          select: { posts: true, givenRatings: true, receivedRatings: true },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _, ...userProfile } = user;
    return userProfile;
  }
}
