import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsDate, IsNotEmpty, IsOptional } from "class-validator";

export class CreateContributionSettingsDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  initDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  endDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  getNotificationForContribution: boolean;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  recordatory: boolean;
}

export class UpdateContributionSettingsDto {
  @ApiProperty()
  @IsOptional()
  @IsDate()
  initDate?: Date;

  @ApiProperty()
  @IsOptional()
  @IsDate()
  endDate?: Date;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  getNotificationForContribution?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  recordatory?: boolean;
}
