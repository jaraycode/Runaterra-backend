import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsDate, IsNotEmpty } from "class-validator";

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
  @IsNotEmpty()
  @IsDate()
  initDate?: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  endDate?: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  getNotificationForContribution?: boolean;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  recordatory?: boolean;
}
