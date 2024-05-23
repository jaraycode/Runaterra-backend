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
  NotFoundException,
  Res,
} from "@nestjs/common";
import { IndicatorsService } from "./services/indicators.service";
import { CreateIndicatorDto } from "./dto/create-indicator.dto";
import { UpdateIndicatorDto } from "./dto/update-indicator.dto";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { Indicator } from "./entities/indicator.entity";
import { ApiException } from "@nanogiants/nestjs-swagger-api-exception-decorator";
import * as express from "express";
import {
  ResponseDeleteIndicator,
  ResponseIndicatorDto,
  ResponseUpdateIndicators,
} from "./response/interceptorResponse";

@ApiTags("indicators")
@Controller("indicators")
export class IndicatorsController {
  constructor(private readonly indicatorsService: IndicatorsService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: "Response of indicator creation",
    type: Indicator,
  })
  async create(@Body() createIndicatorDto: CreateIndicatorDto) {
    return await this.indicatorsService.create(createIndicatorDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: "Response of all indicators",
    type: ResponseIndicatorDto,
  })
  async findAll() {
    return this.indicatorsService.findAll();
  }

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: "Response of indicator by id",
    type: Indicator,
  })
  async findOne(@Param("id") id: string) {
    return await this.indicatorsService.findOne(+id);
  }

  @Patch(":id")
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: "Response of indicator update",
    type: ResponseUpdateIndicators,
  })
  @ApiException(() => NotFoundException, {
    description: "Indicator not found",
  })
  async update(@Param("id") id: string, @Body() updateIndicatorDto: UpdateIndicatorDto, @Res() res: express.Response) {
    try {
      const user = await this.indicatorsService.update(+id, updateIndicatorDto);
      return res.status(HttpStatus.OK).json({
        message: "Indicador actualizado con exito",
        data: user,
      });
    } catch (error) {
      return res.status(error.status).json({
        message: error.message,
      });
    }
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: "Response of indicator deletion",
    type: ResponseDeleteIndicator,
  })
  @ApiException(() => NotFoundException, {
    description: "Indicator not found",
  })
  async remove(@Param("id") id: string, @Res() res: express.Response) {
    try {
      await this.indicatorsService.remove(+id);

      return res.status(HttpStatus.OK).json({
        message: "Indicador eliminado con exito",
      });
    } catch (error) {
      return res.status(error.status).json({
        message: error.message,
      });
    }
  }
}
