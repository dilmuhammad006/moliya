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
import { CategoryService } from './category.service';
import { Protected } from 'src/decorators';
import {
  CreateCategoryDto,
  GetAllCategoryDto,
  UpdateCategoryDto,
} from './dtos';
import { Request } from 'express';

@Controller('category')
export class CategoryController {
  constructor(private readonly service: CategoryService) {}

  @Protected(true)
  @Get()
  async getAll(@Query() payload: GetAllCategoryDto) {
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
    @Body() payload: CreateCategoryDto,
  ) {
    return await this.service.create(payload, req.userId);
  }

  @Protected(true)
  @Patch(':id')
  async update(
    @Req() req: Request & { userId: string },
    @Param('id') id: string,
    @Body() payload: UpdateCategoryDto,
  ) {
    return await this.service.update(payload, req.userId, id);
  }

  @Protected(true)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.service.delete(id);
  }
}
