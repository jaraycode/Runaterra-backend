import { ApiProperty } from "@nestjs/swagger";
import { Link } from "../entities/link.entity";
import { IsArray, IsNotEmpty, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";
import { Transform, Type } from "class-transformer";
import { CreateLinkDto } from "./link.dto";
import { CreateFileDto } from "@src/core/files/dto/create-file.dto";
import { ApiFile } from "@src/common/decorator/fileDecorator";
import { FileData, HasMimeType, IsFileData, MaxFileSize, MimeType } from "nestjs-formdata-interceptor";

export class CreateContributionDto {
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

  @ApiProperty({ type: CreateFileDto, isArray: true, required: true })
  @IsNotEmpty({ message: "El archivo es obligatorio" })
  @Type(() => CreateFileDto)
  file: CreateFileDto[];

  @ApiProperty()
  @IsNotEmpty({ message: "El ID de la categoría es obligatorio" })
  categoryId: number;

  @ApiProperty()
  @IsNotEmpty({ message: "El ID del indicador es obligatorio" })
  indicatorID: number;

  @ApiFile({ isArray: true })
  @IsFileData({ each: true })
  @HasMimeType([
    MimeType["video/mp4"],
    "image/png",
    "image/jpeg",
    MimeType["application/pdf"],
    MimeType["application/msword"],
    MimeType["application/vnd.ms-excel"],
    MimeType["video/x-ms-wmv"],
    MimeType["video/mpeg"],
    MimeType["video/x-msvideo"],
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ])
  files: FileData[];
}
