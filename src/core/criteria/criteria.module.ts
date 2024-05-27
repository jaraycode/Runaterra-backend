import { Module } from "@nestjs/common";
import { CriteriaService } from "./services/criteria.service";
import { CriteriaController } from "./criteria.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Criteria } from "./entities/criteria.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Criteria])],
  controllers: [CriteriaController],
  providers: [CriteriaService],
})
export class CriteriaModule {}
