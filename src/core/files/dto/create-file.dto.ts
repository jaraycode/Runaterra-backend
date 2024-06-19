import { ApiProperty } from "@nestjs/swagger";
import { ApiFile } from "@src/common/decorator/fileDecorator";
import { CreateContributionDto } from "@src/core/contributions/dto/create-contribution.dto";
import { Contribution } from "@src/core/contributions/entities/contribution.entity";
import { IsArray, IsNotEmpty } from "class-validator";
import { FileData, HasMimeType, IsFileData, MaxFileSize, MimeType } from "nestjs-formdata-interceptor";

export class CreateFileDto {
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
  @MaxFileSize(419430400) // 400 MB
  file: FileData;

  contribution: Contribution;
}
