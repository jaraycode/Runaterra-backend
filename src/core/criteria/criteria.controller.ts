import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Res,
  Query,
} from "@nestjs/common";
import { CriteriaService } from "./services/criteria.service";
import { CreateCriteriaDto } from "./dto/create-criteria.dto";
import { UpdateCriteriaDto } from "./dto/update-criteria.dto";
import { ApiException } from "@nanogiants/nestjs-swagger-api-exception-decorator";
import { Criteria } from "./entities/criteria.entity";
import { ApiCreatedResponse, ApiResponse, ApiTags } from "@nestjs/swagger";
import * as express from "express";
import { ResponseUpdateCriteria } from "./response/interceptorResponse";
import { PageOptionsDto } from "@src/common/dto/pageOptions.dto";

@ApiTags("criteria")
@Controller("criteria")
export class CriteriaController {
  constructor(private readonly criteriaService: CriteriaService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({
    status: 200,
    description: "Response of user creation",
    type: Criteria,
  })
  @ApiException(() => BadRequestException, {
    description: "Required atributes were missing",
  })
  async create(@Body() createCriteriaDto: CreateCriteriaDto) {
    return await this.criteriaService.create(createCriteriaDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() pageOptionsDto: PageOptionsDto) {
    return await this.criteriaService.findAll(pageOptionsDto);
  }

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: "Response of criteria by id",
    type: Criteria,
  })
  async findOne(@Param("id") id: string) {
    return await this.criteriaService.findOne(+id);
  }

  @Patch(":id")
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: "Response of user update",
    type: ResponseUpdateCriteria, // ResponseUpdateCriteria
  })
  @ApiException(() => NotFoundException, {
    description: "Criteria not found",
  })
  async update(@Param("id") id: string, @Body() updateCriteriaDto: UpdateCriteriaDto, @Res() res: express.Response) {
    try {
      const criteria = await this.criteriaService.update(+id, updateCriteriaDto);
      return res.status(HttpStatus.OK).json({
        message: "Criterio actualizado con exito",
        data: criteria,
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
      await this.criteriaService.remove(+id);
      return res.status(HttpStatus.OK).json({
        message: "Criterio eliminado con exito",
      });
    } catch (error) {
      return res.status(error.status).json({
        message: error.message,
      });
    }
  }
}
