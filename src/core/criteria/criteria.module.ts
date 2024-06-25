import { Module } from "@nestjs/common";
import { CriteriaService } from "./services/criteria.service";
import { CriteriaController } from "./criteria.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Criteria } from "./entities/criteria.entity";
import { IndicatorsModule } from "../indicators/indicators.module";
import { ExportDocxAction } from "./services/actions/export-docx.action";

@Module({
  imports: [IndicatorsModule, TypeOrmModule.forFeature([Criteria])],
  controllers: [CriteriaController],
  providers: [CriteriaService, ExportDocxAction],
})
export class CriteriaModule {}
