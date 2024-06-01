import { Module } from "@nestjs/common";
import { DptosService } from "./services/dptos.service";
import { DptosController } from "./dptos.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Dpto } from "./entities/dpto.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Dpto])],
  controllers: [DptosController],
  providers: [DptosService],
  exports: [DptosService],
})
export class DptosModule {}
