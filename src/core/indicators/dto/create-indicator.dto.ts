import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateIndicatorDto {
  @ApiProperty({ example: "Infrastructure", required: true })
  @IsNotEmpty()
  @IsDefined()
  @IsString()
  @MinLength(3)
  @MaxLength(40)
  name: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsDefined()
  @IsInt()
  index: number;

  @ApiProperty({ example: "Metrics used to know about the setting of the campus" })
  @IsOptional()
  @IsString()
  description: string;
}
