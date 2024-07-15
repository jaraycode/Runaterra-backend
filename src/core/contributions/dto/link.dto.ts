import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateLinkDto {
  @ApiProperty()
  @IsNotEmpty({ message: "La URL es obligatoria" })
  @IsString({ message: "La URL debe ser una cadena de texto" })
  URL: string;

  @ApiProperty()
  @IsOptional()
  @IsString({ message: "La descripción debe ser una cadena de texto" })
  description: string;
}

export class UpdateLinkDto {
  @ApiProperty()
  @IsOptional()
  @IsString({ message: "La URL debe ser una cadena de texto" })
  URL?: string;

  @ApiProperty()
  @IsOptional()
  @IsString({ message: "La descripción debe ser una cadena de texto" })
  description?: string;
}
