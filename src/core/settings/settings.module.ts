import { Module } from "@nestjs/common";
import { SettingsService } from "./service/settings.service";
import { SettingsController } from "./settings.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../users/entities/user.entity";
import { Setting } from "./entities/setting.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Setting, User])],
  controllers: [SettingsController],
  providers: [SettingsService],
  exports: [SettingsService],
})
export class SettingsModule {}
