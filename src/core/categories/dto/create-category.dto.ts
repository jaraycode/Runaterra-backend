import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateCategoryDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsDefined()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty()
  @IsInt()
  indicatorID: number;

  @ApiProperty({ type: ["number"] })
  @IsNumber({}, { each: true })
  criteriaID: number[];
}
