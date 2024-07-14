import { ApiProperty } from "@nestjs/swagger";
import { ApiFile } from "@src/common/decorator/fileDecorator";
import { Contribution } from "@src/core/contributions/entities/contribution.entity";
import { IsEmpty, IsOptional } from "class-validator";
import { FileData, HasMimeType, IsFileData, MimeType } from "nestjs-formdata-interceptor";

export class PutFileFormattedDto {
  // id
  @ApiProperty({
    example: "UUID",
  })
  @IsOptional()
  id?: number;

  @ApiProperty({
    example: "Documento importante",
  })
  name: string;

  @ApiProperty({
    example: "evidencia de los JUDEIN",
    required: false,
  })
  description: string;

  @ApiFile()
  @IsFileData()
  @IsOptional()
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
  file?: FileData;
}
