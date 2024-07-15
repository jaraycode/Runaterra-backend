import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsDate, IsNotEmpty, IsOptional } from "class-validator";

export class CreateContributionSettingsDto {
  @ApiProperty()
  @IsNotEmpty({ message: "La fecha de inicio es obligatoria" })
  @IsDate({ message: "La fecha de inicio debe ser una fecha válida" })
  initDate: Date;

  @ApiProperty()
  @IsNotEmpty({ message: "La fecha de fin es obligatoria" })
  @IsDate({ message: "La fecha de fin debe ser una fecha válida" })
  endDate: Date;

  @ApiProperty()
  @IsNotEmpty({ message: "La notificación de contribución es obligatoria" })
  @IsBoolean({ message: "La notificación de contribución debe ser un valor booleano" })
  getNotificationForContribution: boolean;

  @ApiProperty()
  @IsNotEmpty({ message: "El recordatorio es obligatorio" })
  @IsBoolean({ message: "El recordatorio debe ser un valor booleano" })
  recordatory: boolean;
}

export class UpdateContributionSettingsDto {
  @ApiProperty()
  @IsOptional()
  @IsDate({ message: "La fecha de inicio debe ser una fecha válida" })
  initDate?: Date;

  @ApiProperty()
  @IsOptional()
  @IsDate({ message: "La fecha de fin debe ser una fecha válida" })
  endDate?: Date;

  @ApiProperty()
  @IsOptional()
  @IsBoolean({ message: "La notificación de contribución debe ser un valor booleano" })
  getNotificationForContribution?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsBoolean({ message: "El recordatorio debe ser un valor booleano" })
  recordatory?: boolean;
}
