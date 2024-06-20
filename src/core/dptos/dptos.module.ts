import { Module } from "@nestjs/common";
import { DptosService } from "./services/dptos.service";
import { DptosController } from "./dptos.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Dpto } from "./entities/dpto.entity";
import { Category } from "../categories/entities/category.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Dpto, Category])],
  controllers: [DptosController],
  providers: [DptosService],
  exports: [DptosService],
})
export class DptosModule {}
