import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from "class-validator";

export class CreateDptoDto {
  @ApiProperty({ example: "Sustentabilidad", required: true })
  @IsNotEmpty({ message: "El nombre es obligatorio" })
  @IsDefined({ message: "El nombre debe estar definido" })
  @IsString({ message: "El nombre debe ser una cadena de texto" })
  @MinLength(3, { message: "El nombre debe tener al menos 3 caracteres" })
  @MaxLength(100, { message: "El nombre no debe exceder los 100 caracteres" })
  name: string;

  @ApiProperty({ type: ["number"], required: true })
  @IsNumber({}, { each: true, message: "Cada ID de categoría debe ser un número" })
  categoriesIDs: number[];
}
