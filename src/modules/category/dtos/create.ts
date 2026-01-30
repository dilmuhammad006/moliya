import { ApiProperty } from '@nestjs/swagger';
import { CategoryType } from '@prisma/client';
import { IsEnum, IsString, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    type: 'string',
    required: true,
    example: 'Oziq ovqat',
  })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({
    type: 'string',
    required: true,
    enum: CategoryType,
    default: CategoryType.INCOME,
  })
  @IsEnum(CategoryType)
  category_type: CategoryType;
}
