import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsUUID } from "class-validator";
import { CreateContributionSettingsDto } from "./contributionSettings.dto";
import { ContributionSettings } from "../entities/contributionSettings.entity";

export class CreateSettingDto {
  @ApiProperty()
  @IsNotEmpty({ message: "La clave es obligatoria" })
  @IsUUID("4", { message: "La clave debe ser un UUID válido" })
  key: string;

  @ApiProperty({ type: CreateContributionSettingsDto, required: true })
  @IsNotEmpty({ message: "Las configuraciones de contribución son obligatorias" })
  @Type(() => CreateContributionSettingsDto)
  contributionSettings: ContributionSettings;
}
