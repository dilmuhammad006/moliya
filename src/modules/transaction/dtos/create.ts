import { ApiProperty } from '@nestjs/swagger';
import { TransactionType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateTransactionDto {
  @ApiProperty({
    type: 'number',
    required: true,
    example: 1.0,
  })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 10 })
  amount: number;

  @ApiProperty({
    type: 'string',
    required: false,
    example: 'string',
  })
  @IsOptional()
  @IsString()
  comment?: string;

  @ApiProperty({
    type: 'string',
    required: true,
    example: 'uuid-id',
  })
  @IsOptional()
  @IsUUID()
  from_account_id: string;

  @ApiProperty({
    type: 'string',
    required: false,
    example: 'uuid-id',
  })
  @IsOptional()
  @IsUUID()
  to_account_id?: string;

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
    required: true,
    enum: TransactionType,
    default: TransactionType.TRANSFER,
  })
  @IsEnum(TransactionType)
  transaction_type: TransactionType;
}
