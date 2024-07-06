import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Res,
} from "@nestjs/common";
import { SettingsService } from "./service/settings.service";
import { CreateSettingDto } from "./dto/create-setting.dto";
import { UpdateSettingDto } from "./dto/update-setting.dto";
import { ActiveUser } from "@src/common/decorator/active-user.decorator";
import { UserActiveInterface } from "@src/common/interface/user.active.interface";
import { UserRole } from "@src/constants";
import { Auth } from "../auth/decorators/auth.decorator";
import { ApiCreatedResponse, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Setting } from "./entities/setting.entity";
import { ApiException } from "@nanogiants/nestjs-swagger-api-exception-decorator";
import * as express from "express";

@ApiTags("settings")
@Controller("settings")
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Auth(UserRole.ADMIN)
  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({
    status: 200,
    description: "Response of user creation",
    type: Setting,
  })
  @ApiException(() => NotFoundException, {
    description: "Required atributes were missing",
  })
  async create(@Body() createSettingDto: CreateSettingDto, @ActiveUser() user: UserActiveInterface) {
    // ? Lack of testing idempotency
    const { key, ...data } = createSettingDto;
    const idempotency = await this.settingsService.findOne(key);

    if (!idempotency) return await this.settingsService.create(createSettingDto, user);

    const updateData: UpdateSettingDto = data;
    return await this.settingsService.update(key, updateData, user);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.settingsService.findAll();
  }

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: "Response of setting by id",
    type: Setting,
  })
  findOne(@Param("id") id: string) {
    return this.settingsService.findOne(id);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: "Response of indicator deletion",
  })
  @ApiException(() => NotFoundException, {
    description: "Contribution Settings not found",
  })
  async remove(@Param("id") id: string, @Res() res: express.Response) {
    try {
      await this.settingsService.remove(id);

      return res.status(HttpStatus.OK).json({
        message: "Configuración eliminado con exito",
      });
    } catch (error) {
      return res.status(error.status).json({
        message: error.message,
      });
    }
  }
}
