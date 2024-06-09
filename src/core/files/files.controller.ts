import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpException,
  HttpStatus,
  Response,
} from "@nestjs/common";
import { FilesService } from "./service/files.service";
import { CreateFileDto } from "./dto/create-file.dto";
import { UpdateFileDto } from "./dto/update-file.dto";
import { ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger";
import * as express from "express";

@ApiTags("files")
@Controller("files")
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiConsumes("multipart/form-data")
  async create(@Body() createFileDto: CreateFileDto) {
    return await this.filesService.create(createFileDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return await this.filesService.findAll();
  }

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  async findOne(@Param("id") id: string) {
    return await this.filesService.findOne(+id);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  async remove(@Param("id") id: string, @Response() res: express.Response) {
    try {
      const response = await this.filesService.remove(+id);
      return res.status(200).send(response);
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, error.getStatus());
      } else {
        console.log(error);
        throw new HttpException("Error interno del servidor", HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }
}
