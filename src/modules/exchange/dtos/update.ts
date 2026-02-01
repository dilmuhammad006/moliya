import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class UpdateExchangeDto {
  @ApiProperty({
    type: 'number',
    required: true,
    example: 1.00,
  })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 10 })
  rate: number;
}
