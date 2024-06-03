import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsDefined, IsOptional, IsString } from "class-validator";

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

  @ApiProperty({ required: false })
  @IsOptional()
  criteriaID: number[];
}
