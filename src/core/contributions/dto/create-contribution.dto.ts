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
  @IsNotEmpty()
  @IsUUID()
  uuid: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({ type: CreateLinkDto, isArray: true, required: true })
  @IsOptional()
  @Type(() => CreateLinkDto)
  @Transform(({ value }) => (typeof value === "string" ? JSON.parse(value) : value))
  @ValidateNested()
  link: Link[];

  @ApiProperty({ type: CreateFileDto, isArray: true, required: true })
  @Type(() => CreateFileDto)
  @ValidateNested({ each: true })
  file: CreateFileDto[];
  
  @ApiProperty()
  categoryId: number;

  @ApiProperty()
  indicatorID: number;

  @ApiFile({ isArray: true })
  @IsArray()
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
