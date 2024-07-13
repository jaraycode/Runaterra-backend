import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { MailsService } from "./service/mails.service";
import { SendEmailDto } from "./dto/sendEmail.dto";

@Controller("mails")
export class MailsController {
  constructor(private readonly mailsService: MailsService) {}

  @Get()
  async sendMail(@Body() sendEmailDto: SendEmailDto) {
    return await this.mailsService.sendMail(sendEmailDto);
  }
}
