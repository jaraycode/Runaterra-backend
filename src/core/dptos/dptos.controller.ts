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
  Res,
  NotFoundException,
  Query,
} from "@nestjs/common";
import { DptosService } from "./services/dptos.service";
import { CreateDptoDto } from "./dto/create-dpto.dto";
import { UpdateDptoDto } from "./dto/update-dpto.dto";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { Dpto } from "./entities/dpto.entity";
import { ApiException } from "@nanogiants/nestjs-swagger-api-exception-decorator";
import { ResponseDptosDto, ResponseUpdateDptos } from "./response/interceptorResponse";
import * as express from "express";
import { ResponseDelete } from "@src/common/response/response";
import { PageOptionsDto } from "@src/common/dto/pageOptions.dto";
import { ApiPaginatedResponse } from "@src/utils/apiPaginatedResponse";

@ApiTags("departments")
@Controller("dptos")
export class DptosController {
  constructor(private readonly dptosService: DptosService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: "Response of department creation",
    type: Dpto,
  })
  @ApiException(() => BadRequestException, {
    description: "Required attributes were missing",
  })
  async create(@Body() createDptoDto: CreateDptoDto) {
    return await this.dptosService.create(createDptoDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiPaginatedResponse(Dpto)
  async findAll(@Query() pageOptionsDto: PageOptionsDto) {
    return await this.dptosService.findAll(pageOptionsDto);
  }

  @Get("notPag")
  @HttpCode(HttpStatus.OK)
  async findAllWithoutPagination() {
    return await this.dptosService.findAllWithoutPagination();
  }

  @Get("matrix") // ! Not working
  @HttpCode(HttpStatus.OK)
  async getMatrix() {
    return await this.dptosService.getMatrix();
  }

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: "Response of department by id",
    type: Dpto,
  })
  async findOne(@Param("id") id: string) {
    return await this.dptosService.findOne(+id);
  }

  @Patch(":id")
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: "Response of department update",
    type: ResponseUpdateDptos,
  })
  @ApiException(() => NotFoundException, {
    description: "Department not found",
  })
  async update(@Param("id") id: string, @Body() updateDptoDto: UpdateDptoDto, @Res() res: express.Response) {
    try {
      const user = await this.dptosService.update(+id, updateDptoDto);
      return res.status(HttpStatus.OK).json({
        message: "Departamento actualizado con exito",
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
    description: "Response of department deletion",
    type: ResponseDelete,
  })
  @ApiException(() => NotFoundException, {
    description: "Department not found",
  })
  async remove(@Param("id") id: string, @Res() res: express.Response) {
    try {
      await this.dptosService.remove(+id);

      return res.status(HttpStatus.OK).json({
        message: "Departamento eliminado con exito",
      });
    } catch (error) {
      return res.status(error.status).json({
        message: error.message,
      });
    }
  }
}
