import { ApiProperty } from "@nestjs/swagger";
import { UserRole } from "@src/constants";
import { isUniqueDb } from "@youba/nestjs-dbvalidator";
import {
  IsEmail,
  IsOptional,
  IsDateString,
  IsDefined,
  IsString,
  MinLength,
  MaxLength,
  Validate,
  IsEnum,
} from "class-validator";

export class UpdateUserDto {
  @ApiProperty({ example: "Emmanuel", required: true })
  @IsDefined()
  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(30)
  name: string;

  @ApiProperty({ example: "admin@gmail.com", required: true })
  @Validate(isUniqueDb, ["user", "email", "El correo ya existe"])
  @IsOptional()
  @IsEmail()
  email: string;

  @ApiProperty({ example: UserRole.DPTO })
  @IsOptional()
  @IsEnum(UserRole, { message: "Rol invalido" })
  role: UserRole;

  @ApiProperty({ example: "2001-02-23" })
  @IsOptional()
  @IsDateString()
  birthdate: string;
}
