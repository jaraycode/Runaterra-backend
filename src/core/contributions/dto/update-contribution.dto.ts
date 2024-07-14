import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";
import { CreateLinkDto } from "./link.dto";
import { Link } from "../entities/link.entity";
import { Type } from "class-transformer";
import { CreateFileDto } from "@src/core/files/dto/create-file.dto";
import { ApiFile } from "@src/common/decorator/fileDecorator";
import { FileData, HasMimeType, IsFileData, MaxFileSize, MimeType } from "nestjs-formdata-interceptor";
import { UpdateFileDto } from "@src/core/files/dto/update-file.dto";
export class UpdateContributionDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  uuid: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({ type: CreateLinkDto, required: true })
  @IsOptional()
  @Type(() => CreateLinkDto)
  @ValidateNested()
  link: CreateLinkDto[];

  @ApiProperty({ type: UpdateFileDto, isArray: true, required: true })
  @IsOptional()
  @Type(() => UpdateFileDto)
  file: UpdateFileDto[];

  @ApiProperty()
  @IsNotEmpty()
  categoryId: number;

  @ApiProperty()
  @IsNotEmpty()
  indicatorID: number;

  @ApiFile({ isArray: true })
  @IsOptional()
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
  @MaxFileSize(419430400) // 400 MB
  files: FileData[];
}
