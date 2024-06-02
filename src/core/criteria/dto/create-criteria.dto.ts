import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateCriteriaDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsDefined()
  @IsString()
  name: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsDefined()
  @IsInt()
  index: number;

  @ApiProperty({ required: false, example: "Metrics used to know about the setting of the campus" })
  @IsOptional()
  @IsString()
  descripction: string;

  @ApiProperty()
  indicatorID: number;

  @ApiProperty()
  categoryID: number;
}
