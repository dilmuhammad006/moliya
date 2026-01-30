import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';

@Module({
  providers: [PrismaService, AccountService],
  controllers: [AccountController],
})
export class AccountModule {}
