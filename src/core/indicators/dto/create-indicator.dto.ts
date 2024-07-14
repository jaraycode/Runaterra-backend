import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsInt, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class CreateIndicatorDto {
  @ApiProperty({ example: "Infraestructura", required: true })
  @IsNotEmpty()
  @IsDefined()
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty({ example: "Infrastructure", required: true })
  @IsNotEmpty()
  @IsDefined()
  @IsString()
  @MinLength(3)
  englishName: string;

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
