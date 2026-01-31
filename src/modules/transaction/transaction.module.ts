import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';

@Module({
  providers: [PrismaService, TransactionService],
  controllers: [TransactionController],
})
export class TransactionModule {}
