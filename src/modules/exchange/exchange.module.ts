import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { ExchangeService } from './exchange.service';
import { ExchangeController } from './exchange.controller';

@Module({
  providers: [PrismaService, ExchangeService],
  controllers: [ExchangeController],
})
export class ExchangeModule {}
