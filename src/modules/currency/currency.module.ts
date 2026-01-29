import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { CurrencyService } from './currency.service';
import { CurrencyController } from './currency.controller';

@Module({
  providers: [PrismaService, CurrencyService],
  controllers: [CurrencyController],
})
export class CurrencyModule {}
