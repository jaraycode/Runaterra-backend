import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsInt, IsOptional, IsString, MinLength } from "class-validator";

export class UpdateIndicatorDto {
  @ApiProperty({ example: "Infrastructure", required: true })
  @IsOptional()
  @IsDefined()
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty({ example: "Infrastructure", required: true })
  @IsOptional()
  @IsDefined()
  @IsString()
  @MinLength(3)
  englishName: string;

  @ApiProperty({ required: true })
  @IsOptional()
  @IsDefined()
  @IsInt()
  index: number;

  @ApiProperty({ example: "Metrics used to know about the setting of the campus" })
  @IsOptional()
  @IsString()
  description: string;
}
