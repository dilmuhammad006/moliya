import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { AccountStatus } from '@prisma/client';

export class GetAllAccountDto {
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
    example: 'something',
  })
  @IsOptional()
  @IsString()
  search: string;

  @ApiProperty({
    type: 'string',
    required: true,
    enum: AccountStatus,
    default: AccountStatus.ACTIVE,
  })
  @IsEnum(AccountStatus)
  account_type: AccountStatus;
}
