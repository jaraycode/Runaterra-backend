import { Module } from "@nestjs/common";
import { ContributionsService } from "./services/contributions.service";
import { ContributionsController } from "./contributions.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Contribution } from "./entities/contribution.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Contribution])],
  controllers: [ContributionsController],
  providers: [ContributionsService],
})
export class ContributionsModule {}
