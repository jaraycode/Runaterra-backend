import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsOptional, IsString } from "class-validator";

export class UpdateCategoryDto {
  @ApiProperty({ required: true })
  @IsOptional()
  @IsDefined()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  descripction: string;
}
