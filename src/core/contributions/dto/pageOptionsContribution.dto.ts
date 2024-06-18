import { ApiPropertyOptional } from "@nestjs/swagger";
import { PageOptionsDto } from "@src/common/dto/pageOptions.dto";
import { Type } from "class-transformer";
import { IsDateString, IsInt, IsOptional, Min } from "class-validator";

export class PageOptionsContributionDto extends PageOptionsDto {
  @ApiPropertyOptional({
    minimum: 1,
    description: "This param is for indicator filter",
  })
  @Min(1)
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  readonly indicatorId?: number;

  @ApiPropertyOptional({
    minimum: 1,
    description: "This param is for departament filter",
  })
  @Min(1)
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  readonly dptoId?: number;

  @ApiPropertyOptional({
    minimum: 1,
    description: "This param is for user filter",
  })
  @Min(1)
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  categoryId?: number;

  @ApiPropertyOptional({
    description: "This param is for date filter",
  })
  @IsOptional()
  @IsDateString()
  @Type(() => Date)
  createAt?: Date;
}
