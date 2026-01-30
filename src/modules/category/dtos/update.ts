import { ApiProperty } from '@nestjs/swagger';
import { CategoryType } from '@prisma/client';
import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateCategoryDto {
  @ApiProperty({
    type: 'string',
    required: false,
    example: 'USD',
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @ApiProperty({
    type: 'string',
    required: false,
    enum: CategoryType,
    default: CategoryType.INCOME,
  })
  @IsOptional()
  @IsEnum(CategoryType)
  category_type?: CategoryType;
}
