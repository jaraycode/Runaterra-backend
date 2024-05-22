import { Module } from "@nestjs/common";
import { IndicatorsService } from "./services/indicators.service";
import { IndicatorsController } from "./indicators.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DbValidatorsModule } from "@youba/nestjs-dbvalidator";
import { Indicator } from "./entities/indicator.entity";
import { ConfigService } from "nestjs-config";

const configService = new ConfigService();

@Module({
  imports: [
    TypeOrmModule.forFeature([Indicator]),
    DbValidatorsModule.register({
      type: "postgres",
      host: configService.get("DATABASE_HOST"),
      port: configService.get("DATABASE_PORT"),
      username: configService.get("DATABASE_USERNAME"),
      password: configService.get("DATABASE_PASSWORD"),
      database: configService.get("DATABASE_NAME"),
    }),
  ],
  controllers: [IndicatorsController],
  providers: [IndicatorsService],
})
export class IndicatorsModule {}
