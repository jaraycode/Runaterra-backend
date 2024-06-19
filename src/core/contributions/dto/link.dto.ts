import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateLinkDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  URL: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description: string;
}

export class UpdateLinkDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  URL?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description?: string;
}
