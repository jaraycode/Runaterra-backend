import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsNumber, IsOptional, IsString } from "class-validator";

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

  @ApiProperty({ required: false, type: ["number"] })
  @IsOptional()
  @IsNumber({}, { each: true })
  criteriaID: number[];
}
