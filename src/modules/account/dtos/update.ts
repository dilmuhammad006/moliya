import { ApiProperty } from '@nestjs/swagger';
import { AccountStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateAccountDto {
  @ApiProperty({
    type: 'string',
    required: false,
    example: 'test',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    type: 'string',
    required: false,
    example: 'uuid-id',
  })
  @IsOptional()
  @IsUUID()
  currency_id?: string;

  @ApiProperty({
    type: 'string',
    required: false,
    enum: AccountStatus,
    default: AccountStatus.ARCHIVED,
  })
  @IsOptional()
  @IsEnum(AccountStatus)
  account_type?: AccountStatus;
}
