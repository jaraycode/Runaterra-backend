import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, MaxLength, MinLength, IsDefined, IsString, IsNotEmpty } from "class-validator";

export class UpdateDptoDto {
  @ApiProperty({ example: "Sustentabilidad", required: true })
  @IsNotEmpty()
  @IsOptional()
  @IsDefined()
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  name: string;
}
