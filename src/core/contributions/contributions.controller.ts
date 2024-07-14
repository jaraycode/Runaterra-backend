import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  BadRequestException,
  Res,
  Req,
  Query,
} from "@nestjs/common";
import { ContributionsService } from "./services/contributions.service";
import { CreateContributionDto } from "./dto/create-contribution.dto";
import { UpdateContributionDto } from "./dto/update-contribution.dto";
import { ApiConsumes, ApiCreatedResponse, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Contribution } from "./entities/contribution.entity";
import { ApiException } from "@nanogiants/nestjs-swagger-api-exception-decorator";
import * as express from "express";
import { PageOptionsContributionDto } from "./dto/pageOptionsContribution.dto";
import { ActiveUser } from "@src/common/decorator/active-user.decorator";
import { UserActiveInterface } from "@src/common/interface/user.active.interface";
import { Auth } from "../auth/decorators/auth.decorator";
import { UserRole } from "@src/constants";
import { getFormattedPutContributionDto } from "./get-formatted-put-contribution-dto";

@ApiTags("contributions")
@Controller("contributions")
export class ContributionsController {
  constructor(private readonly contributionsService: ContributionsService) {}

  @Auth(UserRole.DPTO)
  @ApiConsumes("multipart/form-data")
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
  async create(
    @Body() contributionDto: CreateContributionDto | UpdateContributionDto,
    @ActiveUser() user: UserActiveInterface,
  ) {
    const formattedDto = getFormattedPutContributionDto(contributionDto);

    const contributionAlreadyCreated = await this.contributionsService.findOneByUUID(formattedDto?.uuid);
    if (!contributionAlreadyCreated) {
      return await this.contributionsService.create(formattedDto, user);
    }

    return await this.contributionsService.update(contributionDto.uuid, formattedDto, user);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() pageOptionsDto: PageOptionsContributionDto) {
    return await this.contributionsService.findAll(pageOptionsDto);
  }

  @Auth(UserRole.DPTO)
  @Get("my-contribution")
  @HttpCode(HttpStatus.OK)
  async findMyContribution(
    @Query() pageOptionsDto: PageOptionsContributionDto,
    @ActiveUser() user: UserActiveInterface,
  ) {
    return await this.contributionsService.findMyContribution(pageOptionsDto, user);
  }

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: "Response of criteria by id",
    type: Contribution,
  })
  findOne(@Param("id") id: string) {
    return this.contributionsService.findOne(+id);
  }

  @Delete(":id")
  async remove(@Param("id") id: string, @Res() res: express.Response) {
    try {
      await this.contributionsService.remove(+id);
      return res.status(HttpStatus.OK).json({
        message: "Contribución eliminado con exito",
      });
    } catch (error) {
      return res.status(error.status).json({
        message: error.message,
      });
    }
  }
}
