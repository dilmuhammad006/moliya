import { ApiProperty } from '@nestjs/swagger';
import { IsString,  } from 'class-validator';

export class TokenDto {
  @ApiProperty({
    type: 'string',
    required: true,
    example: 'token',
  })
  @IsString()
  token: string;

}
