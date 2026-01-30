import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AccountService } from './account.service';
import { CreateAaccountDto, GetAllAccountDto, UpdateAccountDto } from './dtos';
import { Protected } from 'src/decorators';
import { Request } from 'express';

@ApiBearerAuth('access-token')
@Controller('account')
export class AccountController {
  constructor(private readonly service: AccountService) {}

  @Protected(true)
  @Get()
  async getAll(@Query() payload: GetAllAccountDto) {
    return await this.service.getAll(payload);
  }

  @Protected(true)
  @Get('my')
  async getMy(@Req() req: Request & { userId: string }) {
    return await this.service.getMy(req.userId);
  }

  @Protected(true)
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return await this.service.getOne(id);
  }

  @Protected(true)
  @Post()
  async create(
    @Req() req: Request & { userId: string },
    @Body() payload: CreateAaccountDto,
  ) {
    return await this.service.create(payload, req.userId);
  }

  @Protected(true)
  @Patch(':id')
  async update(
    @Req() req: Request & { userId: string },
    @Param('id') id: string,
    @Body() payload: UpdateAccountDto,
  ) {
    return await this.service.update(payload, req.userId, id);
  }

  @Protected(true)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.service.delete(id);
  }
}
