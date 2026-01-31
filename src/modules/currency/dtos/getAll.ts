import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetAllCurrencyDto {
  @ApiProperty({
    type: 'number',
    required: false,
    example: 1,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  page: number;

  @ApiProperty({
    type: 'number',
    required: false,
    example: 10,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(10)
  page_size: number;

  @ApiProperty({
    type: 'string',
    required: false,
  })
  @IsOptional()
  @IsString()
  search: string;
}
