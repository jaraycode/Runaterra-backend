import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsUUID } from "class-validator";
import { CreateContributionSettingsDto } from "./contributionSettings.dto";
import { ContributionSettings } from "../entities/contributionSettings.entity";

export class CreateSettingDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  key: string;

  @ApiProperty({ type: CreateContributionSettingsDto, required: true })
  @IsNotEmpty()
  @Type(() => CreateContributionSettingsDto)
  contributionSettings: ContributionSettings;
}
