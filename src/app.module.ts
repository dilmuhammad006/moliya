import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma';
import { APP_GUARD } from '@nestjs/core';
import { CheckAuth } from './guards';
import {
  AccountModule,
  AuthModule,
  CategoryModule,
  CurrencyModule,
} from './modules';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    CurrencyModule,
    CategoryModule,
    AccountModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: CheckAuth,
    },
  ],
})
export class AppModule {}
