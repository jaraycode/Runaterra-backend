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
  IsNumber,
  IsNumberString,
} from "class-validator";

export class UpdateUserDto {
  @ApiProperty({ example: "Emmanuel", required: true })
  @IsDefined({ message: "El nombre es obligatorio" })
  @IsOptional()
  @IsString({ message: "El nombre debe ser una cadena de texto" })
  @MinLength(4, { message: "El nombre debe tener al menos 4 caracteres" })
  @MaxLength(30, { message: "El nombre no puede tener más de 30 caracteres" })
  name: string;

  @ApiProperty({ example: "admin@gmail.com", required: true })
  @Validate(isUniqueDb, ["user", "email", "El correo ya existe"], { message: "El correo ya existe" })
  @IsOptional()
  @IsEmail({}, { message: "El correo debe ser un correo electrónico válido" })
  email: string;

  @ApiProperty({ example: UserRole.DPTO })
  @IsOptional()
  @IsEnum(UserRole, { message: "Rol inválido" })
  role: UserRole;

  @ApiProperty({ example: "2001-02-23" })
  @IsOptional()
  @IsDateString({}, { message: "La fecha de nacimiento debe ser una fecha válida" })
  birthdate: string;

  @ApiProperty({
    example: "1",
    required: true,
  })
  @IsNumberString({}, { message: "El ID del departamento debe ser un número" })
  @IsOptional()
  department: number;
}
