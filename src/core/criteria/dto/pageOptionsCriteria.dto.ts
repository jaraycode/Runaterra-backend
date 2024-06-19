import { ApiPropertyOptional } from "@nestjs/swagger";
import { PageOptionsDto } from "@src/common/dto/pageOptions.dto";
import { Type } from "class-transformer";
import { IsInt, IsOptional, Min } from "class-validator";

export class PageOptionsCriteriaDto extends PageOptionsDto {
  @ApiPropertyOptional({
    minimum: 1,
    description: "This param is for indicator filter",
  })
  @Min(1)
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  readonly indicatorId?: number;
}
