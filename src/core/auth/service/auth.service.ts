import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserRole } from "@src/constants";
import { CreateUserDto } from "@src/core/users/dto/create-user.dto";
import { UsersService } from "@src/core/users/service/users.service";
import * as bcryptjs from "bcryptjs";
import { LoginDto } from "../dto/login.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,

    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.usersService.findByEmailWithPassword(email);

    if (!user) {
      throw new NotFoundException("Usuario no fue encontrado");
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException("Contraseña incorrecta");
    }

    const payload = { email: user.email, id: user.id, role: user.role };

    const token = await this.jwtService.signAsync(payload, { secret: process.env.JWT_SECRET });

    return {
      token,
      email,
      id: user.id,
      role: user.role,
    };
  }

  async register(createUserDto: CreateUserDto) {
    const user = await this.usersService.findByEmailWithPassword(createUserDto.email);

    if (user) {
      throw new UnauthorizedException("Usuario ya existe");
    }

    const newUser = await this.usersService.create({
      ...createUserDto,
      role: UserRole.DPTO,
    });

    return newUser;
  }
}
