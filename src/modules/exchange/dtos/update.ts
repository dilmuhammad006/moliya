import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class UpdateExchangeDto {
  @ApiProperty({
    type: 'string',
    required: true,
    example: '1',
  })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 10 })
  rate: number;
}
