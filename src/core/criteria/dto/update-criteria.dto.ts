import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsInt, IsOptional, IsString } from "class-validator";

export class UpdateCriteriaDto {
  @ApiProperty({ required: true })
  @IsOptional()
  @IsDefined()
  @IsString()
  name: string;

  @ApiProperty({ required: true })
  @IsOptional()
  @IsDefined()
  @IsInt()
  index: number;

  @ApiProperty({ required: false, example: "Metrics used to know about the setting of the campus" })
  @IsOptional()
  @IsString()
  descripction: string;

  @ApiProperty()
  indicatorID: number;
}
