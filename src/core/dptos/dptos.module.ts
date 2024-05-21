import { Module } from "@nestjs/common";
import { DptosService } from "./services/dptos.service";
import { DptosController } from "./dptos.controller";

@Module({
  controllers: [DptosController],
  providers: [DptosService],
})
export class DptosModule {}
