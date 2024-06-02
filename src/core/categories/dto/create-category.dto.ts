import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCategoryDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsDefined()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  descripction: string;

  @ApiProperty()
  indicatorID: number;

  @ApiProperty()
  criteriaID: number[];
}
