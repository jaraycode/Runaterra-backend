import { Module } from "@nestjs/common";
import { CategoriesService } from "./services/categories.service";
import { CategoriesController } from "./categories.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Category } from "./entities/category.entity";
import { IndicatorsModule } from "../indicators/indicators.module";
import { Criteria } from "../criteria/entities/criteria.entity";

@Module({
  imports: [IndicatorsModule, TypeOrmModule.forFeature([Category, Criteria])],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
