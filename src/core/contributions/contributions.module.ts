import { Module } from "@nestjs/common";
import { ContributionsService } from "./services/contributions.service";
import { ContributionsController } from "./contributions.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Contribution } from "./entities/contribution.entity";
import { FilesModule } from "../files/files.module";
import { Category } from "../categories/entities/category.entity";
import { User } from "../users/entities/user.entity";
import { SettingsModule } from "../settings/settings.module";
import { GetContributionAction } from "./services/get-contribution.action";
import { PutContributionAction } from "./services/put-contribution.action";
import { Indicator } from "../indicators/entities/indicator.entity";
import { MailsModule } from "../mails/mails.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Contribution, Category, User, Indicator]),
    FilesModule,
    SettingsModule,
    MailsModule,
  ],
  controllers: [ContributionsController],
  providers: [ContributionsService, GetContributionAction, PutContributionAction],
  exports: [ContributionsService],
})
export class ContributionsModule {}
