import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dtos';
import { Protected } from 'src/decorators';
import { TokenDto } from './dtos/refreshToken';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Protected(false)
  @Post('register')
  async register(@Body() payload: RegisterDto) {
    return await this.service.register(payload);
  }

  @Protected(false)
  @Post('login')
  async login(@Body() payload: LoginDto) {
    return await this.service.login(payload);
  }
  @Protected(false)
  @Post('refresh-token')
  async createRefreshToken(@Body() payload: TokenDto) {
    return await this.service.createRefreshToken(payload.token);
  }
}
