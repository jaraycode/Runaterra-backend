import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from "@nestjs/common";
import { ContributionsService } from "./services/contributions.service";
import { CreateContributionDto } from "./dto/create-contribution.dto";
import { UpdateContributionDto } from "./dto/update-contribution.dto";
import { ApiCreatedResponse } from "@nestjs/swagger";
import { Contribution } from "./entities/contribution.entity";
import { ApiException } from "@nanogiants/nestjs-swagger-api-exception-decorator";

@Controller("contributions")
export class ContributionsController {
  constructor(private readonly contributionsService: ContributionsService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({
    status: 200,
    description: "Response of user creation",
    type: Contribution,
  })
  @ApiException(() => BadRequestException, {
    description: "Required atributes were missing",
  })
  create(@Body() createContributionDto: CreateContributionDto) {
    return this.contributionsService.create(createContributionDto);
  }

  @Get()
  findAll() {
    return this.contributionsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.contributionsService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateContributionDto: UpdateContributionDto) {
    return this.contributionsService.update(+id, updateContributionDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.contributionsService.remove(+id);
  }
}
