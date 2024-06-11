import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateContributionDto } from "./create-contribution.dto";
import { IsArray, IsOptional, IsString, ValidateNested } from "class-validator";
import { CreateLinkDto } from "./link.dto";
import { Link } from "../entities/link.entity";
import { Type } from "class-transformer";
export class UpdateContributionDto extends PartialType(CreateContributionDto) {
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
