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
import { CurrencyService } from './currency.service';
import {
  CreateCurrencyDto,
  GetAllCurrencyDto,
  UpdateCurrencyDto,
} from './dtos';
import { Protected } from 'src/decorators';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth('access-token')
@Controller('currency')
export class CurrencyController {
  constructor(private readonly servcie: CurrencyService) {}

  @Protected(true)
  @Get()
  async getAll(@Query() payload: GetAllCurrencyDto) {
    return await this.servcie.getAll(payload);
  }

  @Protected(true)
  @Get('my')
  async getMy(@Req() req: Request & { userId: string }) {
    return await this.servcie.getMy(req.userId);
  }

  @Protected(true)
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return await this.servcie.getOne(id);
  }

  @Protected(true)
  @Post()
  async create(
    @Body() payload: CreateCurrencyDto,
    @Req() req: Request & { userId: string },
  ) {
    return await this.servcie.create(payload, req.userId);
  }

  @Protected(true)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() payload: UpdateCurrencyDto,
    @Req() req: Request & { userId: string },
  ) {
    return await this.servcie.update(payload, id, req.userId);
  }
  @Protected(true)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.servcie.delete(id);
  }
}
