import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsUUID, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { TransactionType } from '@prisma/client';

export class GetAllTransactionDto {
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
    example: 'uuid-id',
  })
  @IsOptional()
  @IsUUID()
  from_account_id?: string;

  @ApiProperty({
    type: 'string',
    required: false,
    example: 'uuid-id',
  })
  @IsOptional()
  @IsUUID()
  category_id?: string;

  @ApiProperty({
    type: 'string',
    required: false,
    enum: TransactionType,
    default: TransactionType.TRANSFER,
  })
  @IsOptional()
  @IsEnum(TransactionType)
  transaction_type?: TransactionType;
}
