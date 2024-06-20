import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from "class-validator";

export class CreateDptoDto {
  @ApiProperty({ example: "Sustentabilidad", required: true })
  @IsNotEmpty()
  @IsDefined()
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  name: string;

  @ApiProperty({ type: ["number"], required: true })
  @IsNumber({}, { each: true })
  categoriesIDs: number[];
}
