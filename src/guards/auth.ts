import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService, TokenExpiredError, JsonWebTokenError } from '@nestjs/jwt';
import { Request } from 'express';
import { PROTECTED_KEY } from 'src/decorators';

@Injectable()
export class CheckAuth implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwt: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isProtected = this.reflector.getAllAndOverride<boolean>(
      PROTECTED_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (isProtected === false) {
      return true;
    }

    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request & { userId?: string }>();

    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ForbiddenException('Bearer access token topilmadi');
    }

    const accessToken = authHeader.split(' ')[1];

    try {
      const payload = this.jwt.verify(accessToken, {
        secret: process.env.ACCESS_TOKEN_SECRET,
      });

      request.userId = payload.id;
      return true;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new ForbiddenException('Access token muddati tugagan');
      }

      if (error instanceof JsonWebTokenError) {
        throw new ForbiddenException('Access token yaroqsiz');
      }

      throw new InternalServerErrorException('Serverda xatolik yuz berdi');
    }
  }
}
