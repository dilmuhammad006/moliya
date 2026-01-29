import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";

export class UpdateCurrencyDto{
    @ApiProperty({
        type:"string",
        required: true,
        example:"USD"
    })
    @IsString()
    @MinLength(2)
    name: string
}