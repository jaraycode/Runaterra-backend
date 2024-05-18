import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsInt,
  Matches,
  MinLength,
} from 'class-validator';

const roles = ['admin', 'dpto', 'salcedo'];
const passwordRegEx =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&])[A-Za-zd@$!%*?&]{8,20}$/;

export class CreateUserDto {
  @IsNotEmpty()
  @IsInt()
  user_id: number;

  @IsString()
  @MinLength(2, { message: `Debe tener cuanto menos 2 caracteres` })
  @IsNotEmpty()
  nombre: string;

  @IsNotEmpty()
  @IsEmail(null, { message: `Es necesario el correo` })
  correo: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(roles)
  rol: 'admin' | 'dpto' | 'salcedo';

  @IsNotEmpty()
  @IsDate()
  fecha_nacimiento: Date;

  @IsNotEmpty()
  @Matches(passwordRegEx, {
    message: `Password must contain Minimum 8 and maximum 20 characters, 
    at least one uppercase letter, 
    one lowercase letter, 
    one number and 
    one special character`,
  })
  password: string;
}
