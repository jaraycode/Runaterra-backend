import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { CreateLinkDto } from "./link.dto";
import { PutFileFormattedDto } from "@src/core/files/dto/put-file-formatted-dto";

export class PutFormattedContributionDto {
  @ApiProperty()
  @IsNotEmpty({ message: "El UUID es obligatorio" })
  @IsUUID("4", { message: "El UUID debe ser una cadena UUID válida" })
  uuid: string;

  @ApiProperty()
  @IsOptional()
  @IsString({ message: "La descripción debe ser una cadena de texto" })
  description: string;

  @ApiProperty({ type: CreateLinkDto, isArray: true, required: true })
  @IsOptional()
  @Type(() => CreateLinkDto)
  link: CreateLinkDto[];

  @ApiProperty()
  @IsNotEmpty({ message: "El ID de la categoría es obligatorio" })
  categoryId: number;

  @ApiProperty()
  @IsNotEmpty({ message: "El ID del indicador es obligatorio" })
  indicatorID: number;

  @ApiProperty({ type: PutFileFormattedDto, isArray: true, required: true })
  @IsNotEmpty()
  @Type(() => PutFileFormattedDto)
  files: PutFileFormattedDto[];
}
