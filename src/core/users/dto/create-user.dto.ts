import { ApiProperty } from "@nestjs/swagger";
import { Unique } from "@src/common/decorator/nestjs-unique-constraints-validator";
import { UserRole } from "@src/constants";
import { isUniqueDb } from "@youba/nestjs-dbvalidator";
import {
  IsDateString,
  IsDefined,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  Validate,
} from "class-validator";

export class CreateUserDto {
  @ApiProperty({ example: "Emmanuel", required: true })
  @IsNotEmpty()
  @IsDefined()
  @IsString()
  @MinLength(4)
  @MaxLength(30)
  name: string;

  @ApiProperty({ example: "admin@gmail.com", required: true })
  @IsNotEmpty()
  @isUniqueDb({
    table: "user",
    column: "email",
    message: "El correo ya existe",
  })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "S@lcedo2001", required: true })
  @IsNotEmpty()
  @IsDefined()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: "contraseña muy débil",
  })
  password: string;

  @ApiProperty({ example: UserRole.DPTO })
  @IsOptional()
  @IsEnum(UserRole, { message: "Rol invalido" })
  role: UserRole;

  @ApiProperty({ example: "2001-02-23" })
  @IsNotEmpty()
  @IsDateString()
  birthdate: string;
}
