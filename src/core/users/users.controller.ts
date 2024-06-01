import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Res,
  HttpStatus,
  HttpCode,
  BadRequestException,
  ConflictException,
  NotFoundException,
  Query,
} from "@nestjs/common";
import { UsersService } from "./service/users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ApiCreatedResponse, ApiResponse, ApiTags } from "@nestjs/swagger";
import * as express from "express";
import { User } from "./entities/user.entity";
import { ApiException } from "@nanogiants/nestjs-swagger-api-exception-decorator";
import { ResponseUpdateUser, ResponseUserDto } from "@src/core/users/response/interceptorResponse";
import { ResponseDelete } from "@src/common/response/response";
import { PageOptionsDto } from "@src/common/dto/pageOptions.dto";
import { ApiPaginatedResponse } from "@src/utils/apiPaginatedResponse";

@ApiTags("users")
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({
    status: 200,
    description: "Response of user creation",
    type: User,
  })
  @ApiException(() => BadRequestException, {
    description: "Required attributes were missing",
  })
  @ApiException(() => ConflictException, {
    description: "Email already exists",
  })
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiPaginatedResponse(User)
  async findAll(@Query() pageOptionsDto: PageOptionsDto) {
    return await this.usersService.findAll(pageOptionsDto);
  }

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: "Response of user by id",
    type: User,
  })
  async findOne(@Param("id") id: string) {
    return await this.usersService.findOne(+id);
  }

  @Patch(":id")
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: "Response of user update",
    type: ResponseUpdateUser,
  })
  @ApiException(() => NotFoundException, {
    description: "User not found",
  })
  async update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto, @Res() res: express.Response) {
    try {
      const user = await this.usersService.update(+id, updateUserDto);
      return res.status(HttpStatus.OK).json({
        message: "Usuario actualizado con exito",
        data: user,
      });
    } catch (error) {
      return res.status(error.status).json({
        message: error.message,
      });
    }
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: "Response of user deletion",
    type: ResponseDelete,
  })
  @ApiException(() => NotFoundException, {
    description: "User not found",
  })
  async remove(@Param("id") id: string, @Res() res: express.Response) {
    try {
      await this.usersService.remove(+id);

      return res.status(HttpStatus.OK).json({
        message: "Usuario eliminado con exito",
      });
    } catch (error) {
      return res.status(error.status).json({
        message: error.message,
      });
    }
  }
}
