import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsUUID } from 'class-validator';

export class CreateExchangeDto {
  @ApiProperty({
    type: 'string',
    required: true,
    example: 'uuid-id',
  })
  @IsUUID()
  from_currency_id: string;

  @ApiProperty({
    type: 'string',
    required: true,
    example: 'uuid-id',
  })
  @IsUUID()
  to_currency_id: string;

  @ApiProperty({
    type: 'string',
    required: true,
    example: '1',
  })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 10 })
  rate: number;
}
