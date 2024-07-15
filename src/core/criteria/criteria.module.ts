import { Module } from "@nestjs/common";
import { CriteriaService } from "./services/criteria.service";
import { CriteriaController } from "./criteria.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Criteria } from "./entities/criteria.entity";
import { IndicatorsModule } from "../indicators/indicators.module";
import { ExportDocxAction } from "./services/actions/export-docx.action";
import { RenderHeader } from "./services/actions/render-header";
import { RenderContributions } from "./services/actions/render-contribution";
import { HttpModule } from "@nestjs/axios";
import { ImageCellCreator } from "./services/actions/image-cell-creator";

@Module({
  imports: [IndicatorsModule, TypeOrmModule.forFeature([Criteria]), HttpModule],
  controllers: [CriteriaController],
  providers: [CriteriaService, ExportDocxAction, RenderHeader, RenderContributions, ImageCellCreator],
})
export class CriteriaModule {}
