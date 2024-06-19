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
  NotFoundException,
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
import { ResponseUpdateContribution } from "./response/interceptorResponse";
import * as express from "express";
import { PageOptionsContributionDto } from "./dto/pageOptionsContribution.dto";
import { ActiveUser } from "@src/common/decorator/active-user.decorator";
import { UserActiveInterface } from "@src/common/interface/user.active.interface";
import { Auth } from "../auth/decorators/auth.decorator";
import { UserRole } from "@src/constants";
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
  async create(@Body() createContributionDto: CreateContributionDto, @ActiveUser() user: UserActiveInterface) {
    const { uuid, ...rest } = createContributionDto;
    const idempotency = await this.contributionsService.findOneByUUID(uuid);
    if (!idempotency) {
      if (typeof createContributionDto.link === "string") {
        const links = (createContributionDto.link as string).split("},{").map((item) => {
          if (!item.startsWith("{")) item = "{" + item;
          if (!item.endsWith("}")) item = item + "}";
          return JSON.parse(item);
        });
        createContributionDto.link = links;
      }

      if (typeof createContributionDto.file === "string") {
        const files = (createContributionDto.file as string).split("},{").map((item) => {
          if (!item.startsWith("{")) item = "{" + item;
          if (!item.endsWith("}")) item = item + "}";
          return JSON.parse(item);
        });
        createContributionDto.file = files;
      } else if (Array.isArray(createContributionDto.file)) {
        createContributionDto.file = createContributionDto.file.map((item) =>
          typeof item === "string" ? JSON.parse(item) : item,
        );
      }

      return await this.contributionsService.create(createContributionDto, user);
    }
    const updateContributionDto: UpdateContributionDto = rest;
    return await this.contributionsService.update(uuid, updateContributionDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() pageOptionsDto: PageOptionsContributionDto) {
    return await this.contributionsService.findAll(pageOptionsDto);
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

  @Patch(":id")
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: "Response of user update",
    type: ResponseUpdateContribution,
  })
  @ApiException(() => NotFoundException, {
    description: "Contribution not found",
  })
  async update(
    @Param("uuid") uuid: string,
    @Body() updateContributionDto: UpdateContributionDto,
    @Res() res: express.Response,
  ) {
    try {
      const contribution = await this.contributionsService.update(uuid, updateContributionDto);
      return res.status(HttpStatus.OK).json({
        message: "Contribución actualizado con exito",
        data: contribution,
      });
    } catch (error) {
      return res.status(error.status).json({
        message: error.message,
      });
    }
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
