import { Module } from "@nestjs/common";
import { MailsService } from "./service/mails.service";
import { MailsController } from "./mails.controller";
import { MailerModule } from "@nestjs-modules/mailer";
import { envData } from "@src/config/typeorm";
import { UsersModule } from "../users/users.module";
import { SettingsModule } from "../settings/settings.module";
import { ScheduleModule } from "@nestjs/schedule";

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: envData.EMAIL_HOST,
        port: envData.EMAIL_PORT,
        auth: {
          user: envData.EMAIL_USERNAME,
          pass: envData.EMAIL_PASSWORD,
        },
      },
    }),
    UsersModule,
    SettingsModule,
  ],
  controllers: [MailsController],
  providers: [MailsService],
  exports: [MailsService],
})
export class MailsModule {}
