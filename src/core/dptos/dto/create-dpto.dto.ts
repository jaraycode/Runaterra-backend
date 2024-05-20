import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateDptoDto {
  @ApiProperty({ example: "Sustentabilidad", required: true })
  @IsNotEmpty()
  @IsDefined()
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  name: string;
}
