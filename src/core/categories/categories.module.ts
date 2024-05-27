import { Module } from "@nestjs/common";
import { CategoriesService } from "./services/categories.service";
import { CategoriesController } from "./categories.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Category } from "./entities/category.entity";
import { IndicatorsModule } from "../indicators/indicators.module";

@Module({
  imports: [IndicatorsModule, TypeOrmModule.forFeature([Category])],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
