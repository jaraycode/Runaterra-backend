import { ApiProperty } from "@nestjs/swagger";
import { Link } from "../entities/link.entity";
import { IsOptional, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { CreateLinkDto } from "./link.dto";

export class CreateContributionDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({ type: CreateLinkDto, required: true })
  @IsOptional()
  @Type(() => Link)
  @ValidateNested()
  link: Link[];
}
