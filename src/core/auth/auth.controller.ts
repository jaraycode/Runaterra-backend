import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";
import { AuthService } from "./service/auth.service";
import { LoginDto } from "./dto/login.dto";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { ApiTags } from "@nestjs/swagger";
import { ApiException } from "@nanogiants/nestjs-swagger-api-exception-decorator";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiException(() => NotFoundException, {
    description: "User not found",
  })
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @Post("register")
  @HttpCode(HttpStatus.OK)
  @ApiException(() => BadRequestException, {
    description: "Password is weak",
  })
  @ApiException(() => ConflictException, {
    description: "Email must be unique",
  })
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.authService.register(createUserDto);
  }
}
