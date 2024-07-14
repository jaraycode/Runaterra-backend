import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { CreateLinkDto } from "./link.dto";
import { PutFileFormattedDto } from "@src/core/files/dto/put-file-formatted-dto";

export class PutFormattedContributionDto {
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
  link: CreateLinkDto[];

  @ApiProperty()
  @IsNotEmpty()
  categoryId: number;

  @ApiProperty()
  @IsNotEmpty()
  indicatorID: number;

  @ApiProperty({ type: PutFileFormattedDto, isArray: true, required: true })
  @IsNotEmpty()
  @Type(() => PutFileFormattedDto)
  files: PutFileFormattedDto[];
}
