import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsUUID, ValidateNested } from "class-validator";
import { ContributionSettings } from "../entities/contributionSettings.entity";
import { CreateContributionSettingsDto } from "./contributionSettings.dto";
import { Type } from "class-transformer";

export class UpdateSettingDto {
  @ApiProperty({ type: CreateContributionSettingsDto, required: true })
  @IsOptional()
  @Type(() => CreateContributionSettingsDto)
  @ValidateNested({
    message: "Las configuraciones de contribución son invalidas",
  })
  contributionSettings: ContributionSettings;
}
