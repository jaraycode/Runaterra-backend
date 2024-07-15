import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { SendEmailDto } from "../dto/sendEmail.dto";
import { Cron, CronExpression, SchedulerRegistry } from "@nestjs/schedule";
import { UsersService } from "@src/core/users/service/users.service";
import { SettingsService } from "@src/core/settings/service/settings.service";
import { Logger } from "@nestjs/common";

@Injectable()
export class MailsService {
  constructor(
    private readonly mailsService: MailerService,
    private readonly usersService: UsersService,
    private readonly settingsService: SettingsService,
  ) {}

  private readonly logs = new Logger(MailsService.name);

  async sendMail(sendEmailDto: SendEmailDto) {
    this.logs.log("enviando correo");
    await this.mailsService.sendMail({
      from: `Greenie Metric <${process.env.EMAIL_USERNAME}>`,
      to: sendEmailDto.email,
      subject: sendEmailDto.subject,
      text: sendEmailDto.message,
    });
  }

  async sendMailToAllUsers() {
    this.logs.log("enviando correos a todos los usuarios");
    const users = await this.usersService.findAllNotPaginated();
    const remainingTime = await this.settingsService.daysRemaining();
    const sendEmailDto = new SendEmailDto();
    sendEmailDto.subject = `Recordatorio: Quedan ${remainingTime} dias para finalizar el periodo de subida de aportes.`;
    sendEmailDto.message = `Este es un recordatorio de que quedan ${remainingTime} dias para finalizar el periodo de subida de aportes de Greenie Metric.`;

    for (const user of users) {
      sendEmailDto.email = user.email;
      await this.sendMail(sendEmailDto);
    }
  }

  @Cron("0 0 */5 * *")
  async handleCron() {
    this.logs.log("verificacion de tiempo restante para finalizar el periodo de subida de aportes");
    const uuid = `81ed6231-5be6-4166-9118-d982038a2fc7`;
    const setting = await this.settingsService.findOne(uuid);

    if (!setting) {
      return null;
    }

    if (setting.contributionSettings.recordatory === false) {
      return null;
    }

    const remainingTime = await this.settingsService.daysRemaining();

    const totalDays = await this.settingsService.TotalDays();

    const threshold = totalDays * 0.2;

    if (remainingTime <= threshold) {
      await this.sendMailToAllUsers();
    }
  }
}
