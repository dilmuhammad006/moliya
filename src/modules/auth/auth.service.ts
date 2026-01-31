import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma';
import { LoginDto, RegisterDto } from './dtos';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async register(payload: RegisterDto) {
    const founded = await this.prisma.user.findUnique({
      where: {
        email: payload.email,
      },
    });

    if (founded) {
      throw new ConflictException(
        "Bu email orqali allaqachon ro'yxatdan o'tilgan!",
      );
    }
    const hashedPassword = await bcrypt.hash(payload.password, 10);

    const user = await this.prisma.user.create({
      data: {
        full_name: payload.full_name,
        password: hashedPassword,
        email: payload.email,
      },
    });
    const { refreshToken, accessToken } = await this.#_createToken(user.id);

    return {
      success: true,
      message: "Siz muvaffaqaiya bilan ro'yxatdan o'tdingiz",
      data: {
        user,
        tokens: {
          accessToken,
          refreshToken,
        },
      },
    };
  }

  async login(payload: LoginDto) {
    const founded = await this.prisma.user.findUnique({
      where: {
        email: payload.email,
      },
    });

    if (!founded) {
      throw new NotFoundException(
        "Bu ma'motlar orqali foydalanuvchi ro'yxatdan o'tmagan!",
      );
    }

    const passwordMatch = await bcrypt.compare(
      payload.password,
      founded.password,
    );

    if (!passwordMatch) {
      throw new BadRequestException(
        "Bu ma'motlar orqali foydalanuvchi ro'yxatdan o'tmagan!",
      );
    }

    const { refreshToken, accessToken } = await this.#_createToken(founded.id);

    return {
      success: true,
      message: 'Muvaffaqiyatli tizimga kirdingiz',
      data: {
        user: founded,
        tokens: {
          accessToken,
          refreshToken,
        },
      },
    };
  }

  async createRefreshToken(token: string) {
    try {
      if (!token) {
        throw new ForbiddenException('Refresh token topilmadi');
      }

      const payload = await this.jwt.verifyAsync(token, {
        secret: process.env.REFRESH_TOKEN_SECRET,
      });

      const { accessToken, refreshToken } = await this.#_createToken(
        payload.id,
      );

      return {
        success: true,
        message: 'Tokenlar yangilandi',
        data: {
          tokens: {
            accessToken,
            refreshToken,
          },
        },
      };
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new ForbiddenException('Refresh token muddati tugagan');
      }

      if (error.name === 'JsonWebTokenError') {
        throw new ForbiddenException('Refresh token yaroqsiz');
      }

      throw new InternalServerErrorException('Token tekshirishda xatolik');
    }
  }

  async me(user_id: string) {
    const founded = await this.prisma.user.findFirst({
      where: {
        id: user_id,
      },
    });
    if (!founded) {
      throw new NotFoundException("Bunday ma'lumotli foydalanuvchi topilmadi!");
    }

    return {
      success: true,
      message: 'Foydalanuvchi profile',
      data: founded,
    };
  }

  async #_createToken(id: string) {
    const payload = { id };

    const accessToken = await this.jwt.signAsync(payload, {
      expiresIn: '7d',
      secret: process.env.ACCESS_TOKEN_SECRET,
    });

    const refreshToken = await this.jwt.signAsync(payload, {
      expiresIn: '31d',
      secret: process.env.REFRESH_TOKEN_SECRET,
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
