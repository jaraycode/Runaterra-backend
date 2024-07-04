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
} from "@nestjs/common";
import { SettingsService } from "./service/settings.service";
import { CreateSettingDto } from "./dto/create-setting.dto";
import { UpdateSettingDto } from "./dto/update-setting.dto";
import { ActiveUser } from "@src/common/decorator/active-user.decorator";
import { UserActiveInterface } from "@src/common/interface/user.active.interface";
import { UserRole } from "@src/constants";
import { Auth } from "../auth/decorators/auth.decorator";
import { ApiCreatedResponse } from "@nestjs/swagger";
import { Setting } from "./entities/setting.entity";
import { ApiException } from "@nanogiants/nestjs-swagger-api-exception-decorator";

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
  create(@Body() createSettingDto: CreateSettingDto, @ActiveUser() user: UserActiveInterface) {
    // ! Lack of idempotency
    return this.settingsService.create(createSettingDto, user);
  }

  @Get()
  findAll() {
    return this.settingsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.settingsService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateSettingDto: UpdateSettingDto) {
    return this.settingsService.update(+id, updateSettingDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.settingsService.remove(+id);
  }
}
