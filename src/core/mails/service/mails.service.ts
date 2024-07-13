import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { SendEmailDto } from "../dto/sendEmail.dto";

@Injectable()
export class MailsService {
  constructor(private readonly mailsService: MailerService) {}

  async sendMail(sendEmailDto: SendEmailDto) {
    await this.mailsService.sendMail({
      from: `Greenie Metric <${process.env.EMAIL_USERNAME}>`,
      to: sendEmailDto.email,
      subject: sendEmailDto.subject,
      text: sendEmailDto.message,
    });
  }
}
