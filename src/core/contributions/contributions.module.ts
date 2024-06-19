import { Module } from "@nestjs/common";
import { ContributionsService } from "./services/contributions.service";
import { ContributionsController } from "./contributions.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Contribution } from "./entities/contribution.entity";
import { FilesModule } from "../files/files.module";
import { Category } from "../categories/entities/category.entity";
import { User } from "../users/entities/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Contribution, Category, User]), FilesModule],
  controllers: [ContributionsController],
  providers: [ContributionsService],
})
export class ContributionsModule {}
