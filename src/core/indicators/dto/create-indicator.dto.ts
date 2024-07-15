import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsInt, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class CreateIndicatorDto {
  @ApiProperty({ example: "Infraestructura", required: true })
  @IsNotEmpty({ message: "El nombre es obligatorio" })
  @IsDefined({ message: "El nombre debe estar definido" })
  @IsString({ message: "El nombre debe ser una cadena de texto" })
  @MinLength(3, { message: "El nombre debe tener al menos 3 caracteres" })
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

  @ApiProperty({ example: "Métricas utilizadas para conocer el estado del campus" })
  @IsOptional()
  @IsString({ message: "La descripción debe ser una cadena de texto" })
  description: string;
}
