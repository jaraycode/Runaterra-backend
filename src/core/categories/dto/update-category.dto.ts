import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsInt, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateCategoryDto {
  @ApiProperty({ required: true })
  @IsOptional()
  @IsDefined()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  indicatorID: number;

  @ApiProperty({ required: false, type: ["number"] })
  @IsOptional()
  @IsNumber({}, { each: true })
  criteriaID: number[];
}
