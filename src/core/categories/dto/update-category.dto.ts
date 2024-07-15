import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsInt, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateCategoryDto {
  @ApiProperty({ required: true })
  @IsOptional()
  @IsDefined({ message: "El nombre debe estar definido" })
  @IsString({ message: "El nombre debe ser una cadena de texto" })
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: "La descripción debe ser una cadena de texto" })
  description: string;

  @ApiProperty()
  @IsOptional()
  @IsInt({ message: "El ID del indicador debe ser un número entero" })
  indicatorID: number;

  @ApiProperty({ required: false, type: ["number"] })
  @IsOptional()
  @IsNumber({}, { each: true, message: "Cada ID de criterio debe ser un número" })
  criteriaID: number[];
}
