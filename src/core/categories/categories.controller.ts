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
} from "@nestjs/common";
import { CategoriesService } from "./services/categories.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { ApiException } from "@nanogiants/nestjs-swagger-api-exception-decorator";
import { Category } from "./entities/category.entity";
import { ApiCreatedResponse, ApiResponse, ApiTags } from "@nestjs/swagger";
import * as express from "express";

@ApiTags("categories")
@Controller("categories")
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({
    status: 200,
    description: "Response of user creation",
    type: Category,
  })
  @ApiException(() => BadRequestException, {
    description: "Required atributes were missing",
  })
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    console.log(createCategoryDto);
    return await this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return await this.categoriesService.findAll();
  }

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: "Response of category by id",
    type: Category,
  })
  async findOne(@Param("id") id: string) {
    return await this.categoriesService.findOne(+id);
  }

  @Patch(":id")
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: "Response of user update",
    type: Category, // ResponseUpdateCategory
  })
  @ApiException(() => NotFoundException, {
    description: "Category not found",
  })
  async update(@Param("id") id: string, @Body() updateCategoryDto: UpdateCategoryDto, @Res() res: express.Response) {
    try {
      const category = await this.categoriesService.update(+id, updateCategoryDto);
      return res.status(HttpStatus.OK).json({
        message: "Categoría actualizado con exito",
        data: category,
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
      await this.categoriesService.remove(+id);
      return res.status(HttpStatus.OK).json({
        message: "Categoría eliminada con exito",
      });
    } catch (error) {
      return res.status(error.status).json({
        message: error.message,
      });
    }
  }
}
