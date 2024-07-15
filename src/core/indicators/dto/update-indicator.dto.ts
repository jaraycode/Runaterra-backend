import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsInt, IsOptional, IsString, MinLength } from "class-validator";

export class UpdateIndicatorDto {
  @ApiProperty({ example: "Infrastructure", required: true })
  @IsOptional()
  @IsDefined({ message: "El nombre debe estar definido" })
  @IsString({ message: "El nombre debe ser una cadena de texto" })
  @MinLength(3, { message: "El nombre debe tener al menos 3 caracteres" })
  name: string;

  @ApiProperty({ example: "Infrastructure", required: true })
  @IsOptional()
  @IsDefined({ message: "El nombre en inglés debe estar definido" })
  @IsString({ message: "El nombre en inglés debe ser una cadena de texto" })
  @MinLength(3, { message: "El nombre en inglés debe tener al menos 3 caracteres" })
  englishName: string;

  @ApiProperty({ required: true })
  @IsOptional()
  @IsDefined({ message: "El índice debe estar definido" })
  @IsInt({ message: "El índice debe ser un número entero" })
  index: number;

  @ApiProperty({ example: "Metrics used to know about the setting of the campus" })
  @IsOptional()
  @IsString({ message: "La descripción debe ser una cadena de texto" })
  description: string;
}
