import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateCategoryDto } from "../dto/create-category.dto";
import { UpdateCategoryDto } from "../dto/update-category.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "../entities/category.entity";
import { Repository } from "typeorm";
import { IndicatorsService } from "@src/core/indicators/services/indicators.service";
import { Indicator } from "@src/core/indicators/entities/indicator.entity";

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly indicatorService: IndicatorsService,
  ) {}
  async create(createCategoryDto: CreateCategoryDto) {
    const indicator = await this.indicatorService.findOne(createCategoryDto.indicatorID);

    if (!indicator) {
      throw new BadRequestException("El indicador no existe");
    }

    const newCategory = await this.categoryRepository.create({ ...createCategoryDto, indicator: indicator });

    await this.categoryRepository.save(newCategory);
    return newCategory;
  }

  async findAll() {
    return `This action returns all categories`;
  }

  async findOne(id: number) {
    return await this.categoryRepository.findOne({ where: { id } });
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  async remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
