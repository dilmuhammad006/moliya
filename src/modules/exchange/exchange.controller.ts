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
import { ExchangeService } from './exchange.service';
import { Protected } from 'src/decorators';
import {
  CreateExchangeDto,
  GetAllExchangeDto,
  UpdateExchangeDto,
} from './dtos';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth('access-token')
@Controller('exchange')
export class ExchangeController {
  constructor(private readonly service: ExchangeService) {}

  @Protected(true)
  @Get('my')
  async getAll(
    @Req() req: Request & { userId: string },
    @Query() payload: GetAllExchangeDto,
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
    @Body() payload: CreateExchangeDto,
  ) {
    return await this.service.create(payload, req.userId);
  }

  @Protected(true)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() payload: UpdateExchangeDto) {
    return await this.service.update(payload, id);
  }
}
