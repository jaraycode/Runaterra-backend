import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateCategoryDto } from "../dto/create-category.dto";
import { UpdateCategoryDto } from "../dto/update-category.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "../entities/category.entity";
import { In, Repository } from "typeorm";
import { IndicatorsService } from "@src/core/indicators/services/indicators.service";
import { Indicator } from "@src/core/indicators/entities/indicator.entity";
import { Criteria } from "@src/core/criteria/entities/criteria.entity";

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly indicatorService: IndicatorsService,
    @InjectRepository(Criteria)
    private readonly criteriaRepository: Repository<Criteria>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    try {
      console.log(createCategoryDto);
      const indicator = await this.indicatorService.findOne(createCategoryDto.indicatorID);

      if (!indicator) {
        throw new BadRequestException("El indicador no existe");
      }

      const criteria = await this.criteriaRepository.find({
        where: {
          id: In(createCategoryDto.criteriaID),
        },
      });

      if (criteria.length !== createCategoryDto.criteriaID.length) {
        throw new BadRequestException("Alguno de los criterios ingresados no existe");
      }

      const newCategory = await this.categoryRepository.create({
        ...createCategoryDto,
        indicator: indicator,
        criteria: criteria,
      });

      await this.categoryRepository.save(newCategory);
      return newCategory;
    } catch (error) {
      console.log(error);
    }
  }

  // TODO: pagination
  async findAll(): Promise<Category[]> {
    return await this.categoryRepository.find();
  }

  async findOne(id: number): Promise<Category> {
    return await this.categoryRepository.findOne({ where: { id } });
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOne(id);

    if (!category) {
      throw new NotFoundException("Categoría no encontrado");
    }

    const result = await this.categoryRepository.update(id, updateCategoryDto);

    if (result.affected === 0) {
      throw new NotFoundException("La actualización de la categoría no se pudo realizar");
    }
    return await this.findOne(id); // returning the updated row
  }

  async remove(id: number): Promise<void> {
    const category = await this.findOne(id);

    if (!category) {
      throw new NotFoundException("Categoría no encontrado");
    }

    const result = await this.categoryRepository.softDelete(id);

    if (result.affected === 0) {
      throw new NotFoundException("La eliminación de la categoría no se pudo realizar");
    }
    return;
  }
}
