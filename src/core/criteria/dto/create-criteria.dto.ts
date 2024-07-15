import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsIn, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateCriteriaDto {
  @ApiProperty({ required: true, example: "Settings" })
  @IsNotEmpty({ message: "El nombre es obligatorio" })
  @IsDefined({ message: "El nombre debe estar definido" })
  @IsString({ message: "El nombre debe ser una cadena de texto" })
  name: string;

  @ApiProperty({ example: "Infrastructure", required: true })
  @IsNotEmpty({ message: "El nombre en inglés es obligatorio" })
  @IsDefined({ message: "El nombre en inglés debe estar definido" })
  @IsString({ message: "El nombre en inglés debe ser una cadena de texto" })
  @MinLength(3, { message: "El nombre en inglés debe tener al menos 3 caracteres" })
  englishName: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: "El índice es obligatorio" })
  @IsDefined({ message: "El índice debe estar definido" })
  @IsInt({ message: "El índice debe ser un número entero" })
  index: number;

  @ApiProperty({ required: false, example: "Metrics used to know about the setting of the campus" })
  @IsOptional()
  @IsString({ message: "La descripción debe ser una cadena de texto" })
  description: string;

  @ApiProperty()
  @IsNotEmpty({ message: "El ID del indicador es obligatorio" })
  @IsDefined({ message: "El ID del indicador debe estar definido" })
  @IsInt({ message: "El ID del indicador debe ser un número entero" })
  indicatorID: number;
}
