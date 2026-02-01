import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateAaccountDto {
  @ApiProperty({
    type: 'string',
    required: true,
    example: 'test',
  })
  @IsString()
  name: string;

  @ApiProperty({
    type: 'number',
    required: false,
    example: 1.0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 10 })
  balance?: number;

  @ApiProperty({
    type: 'string',
    required: true,
    example: 'uuid-id',
  })
  @IsUUID()
  currency_id: string;
}
