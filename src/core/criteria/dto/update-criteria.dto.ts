import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsInt, IsOptional, IsString } from "class-validator";

export class UpdateCriteriaDto {
  @ApiProperty({ required: true })
  @IsOptional()
  @IsDefined({ message: "El nombre debe estar definido" })
  @IsString({ message: "El nombre debe ser una cadena de texto" })
  name: string;

  @ApiProperty({ example: "Infrastructure", required: true })
  @IsOptional()
  @IsDefined({ message: "El nombre en inglés debe estar definido" })
  @IsString({ message: "El nombre en inglés debe ser una cadena de texto" })
  englishName: string;

  @ApiProperty({ required: true })
  @IsOptional()
  @IsDefined({ message: "El índice debe estar definido" })
  @IsInt({ message: "El índice debe ser un número entero" })
  index: number;

  @ApiProperty({ required: false, example: "Metrics used to know about the setting of the campus" })
  @IsOptional()
  @IsString({ message: "La descripción debe ser una cadena de texto" })
  description: string;

  @ApiProperty()
  @IsOptional()
  @IsDefined({ message: "El ID del indicador debe estar definido" })
  @IsInt({ message: "El ID del indicador debe ser un número entero" })
  indicatorID: number;
}
