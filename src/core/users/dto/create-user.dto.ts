import { ApiProperty } from "@nestjs/swagger";
import { Unique } from "@src/common/decorator/nestjs-unique-constraints-validator";
import { UserRole } from "@src/constants";
import { Dpto } from "@src/core/dptos/entities/dpto.entity";
import { isUniqueDb } from "@youba/nestjs-dbvalidator";
import {
  IsDateString,
  IsDefined,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  Validate,
} from "class-validator";

export class CreateUserDto {
  @ApiProperty({ example: "Emmanuel", required: true })
  @IsNotEmpty({ message: "El nombre es obligatorio" })
  @IsDefined({ message: "El nombre es obligatorio" })
  @IsString({ message: "El nombre debe ser una cadena de texto" })
  @MinLength(4, { message: "El nombre debe tener al menos 4 caracteres" })
  @MaxLength(30, { message: "El nombre no puede tener más de 30 caracteres" })
  name: string;

  @ApiProperty({ example: "admin@gmail.com", required: true })
  @IsNotEmpty({ message: "El correo es obligatorio" })
  @isUniqueDb({
    table: "user",
    column: "email",
    message: "El correo ya existe",
  })
  @IsEmail({}, { message: "El correo debe ser un correo electrónico válido" })
  email: string;

  @ApiProperty({ example: "S@lcedo2001", required: true })
  @IsNotEmpty({ message: "La contraseña es obligatoria" })
  @IsDefined({ message: "La contraseña es obligatoria" })
  @IsString({ message: "La contraseña debe ser una cadena de texto" })
  @MinLength(8, { message: "La contraseña debe tener al menos 8 caracteres" })
  @MaxLength(20, { message: "La contraseña no puede tener más de 20 caracteres" })
  password: string;

  @ApiProperty({ example: UserRole.DPTO })
  @IsOptional()
  @IsEnum(UserRole, { message: "Rol inválido" })
  role: UserRole;

  @ApiProperty({ example: "2001-02-23" })
  @IsNotEmpty({ message: "La fecha de nacimiento es obligatoria" })
  @IsDateString({}, { message: "La fecha de nacimiento debe ser una fecha válida" })
  birthdate: string;

  @ApiProperty({
    example: "1",
  })
  @IsNotEmpty({ message: "El departamento es obligatorio" })
  @IsDefined({ message: "El departamento es obligatorio" })
  @IsNumberString({}, { message: "El ID del departamento debe ser un número" })
  departmentId: number;
}
