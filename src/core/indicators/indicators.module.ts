import { Module } from "@nestjs/common";
import { IndicatorsService } from "./services/indicators.service";
import { IndicatorsController } from "./indicators.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DbValidatorsModule } from "@youba/nestjs-dbvalidator";
import { Indicator } from "./entities/indicator.entity";
import { ConfigService } from "nestjs-config";

const configService = new ConfigService();

@Module({
  imports: [TypeOrmModule.forFeature([Indicator])],
  controllers: [IndicatorsController],
  providers: [IndicatorsService],
  exports: [IndicatorsService],
})
export class IndicatorsModule {}
