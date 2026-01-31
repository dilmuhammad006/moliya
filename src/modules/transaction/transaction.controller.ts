import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { Request } from 'express';
import { CreateTransactionDto, GetAllTransactionDto } from './dtos';
import { Protected } from 'src/decorators';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth('access-token')
@Controller('transaction')
export class TransactionController {
  constructor(private readonly service: TransactionService) {}

  @Protected(true)
  @Get('my')
  async getAll(
    @Req() req: Request & { userId: string },
    @Query() payload: GetAllTransactionDto,
  ) {
    return await this.service.getAll(payload, req.userId);
  }

  @Protected(true)
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return await this.service.getOne(id);
  }

  @Protected(true)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.service.delete(id);
  }

  @Protected(true)
  @Post()
  async create(
    @Req() req: Request & { userId: string },
    @Body() payload: CreateTransactionDto,
  ) {
    return await this.service.create(payload, req.userId);
  }
}
