import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateCategoryDto } from "../dto/create-category.dto";
import { UpdateCategoryDto } from "../dto/update-category.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "../entities/category.entity";
import { In, Repository } from "typeorm";
import { IndicatorsService } from "@src/core/indicators/services/indicators.service";
import { Indicator } from "@src/core/indicators/entities/indicator.entity";
import { Criteria } from "@src/core/criteria/entities/criteria.entity";
import { PageOptionsDto } from "@src/common/dto/pageOptions.dto";
import { PageDto } from "@src/common/dto/page.dto";
import { PageMetaDto } from "@src/common/dto/page.meta.dto";

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
      const indicator = await this.indicatorService.findOne(createCategoryDto.indicatorID);

      if (!indicator) {
        throw new BadRequestException("El indicador no existe");
      }

      const criteria = await this.criteriaRepository.find({
        where: {
          id: In(createCategoryDto.criteriaID),
        },
        relations: ["categories"],
      });

      if (criteria.length !== createCategoryDto.criteriaID.length) {
        throw new BadRequestException("Alguno de los criterios ingresados no existe");
      }

      for (let c of criteria) {
        if (c.categories) throw new BadRequestException("Algún criterio ya posee categoria asociada");
      }

      const newCategory = await this.categoryRepository.create({
        ...createCategoryDto,
        indicator: indicator,
        criteria: criteria,
      });

      await this.categoryRepository.save(newCategory);
      return newCategory;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findAll(): Promise<Category[]> {
    return await this.categoryRepository.find({
      relations: ["indicator", "criteria"],
    });
  }

  async findAllPaginated(pageOptionsDto: PageOptionsDto): Promise<PageDto<Category>> {
    const queryBuilder = this.categoryRepository.createQueryBuilder("category");

    queryBuilder.leftJoinAndSelect("category.indicator", "indicator");
    queryBuilder.leftJoinAndSelect("category.criteria", "criteria");

    queryBuilder.orderBy("category.id", "DESC").skip(pageOptionsDto.skip).take(pageOptionsDto.take);

    const [categories, count] = await queryBuilder.getManyAndCount();

    const pageMetaDto = new PageMetaDto({
      pageOptionsDto,
      itemCount: count,
    });

    return new PageDto(categories, pageMetaDto);
  }

  async findOne(id: number): Promise<Category> {
    return await this.categoryRepository.findOne({ where: { id }, relations: ["indicator", "criteria"] });
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOne(id);
    const { criteriaID, indicatorID, ...data } = updateCategoryDto;

    if (!category) {
      throw new NotFoundException("Categoría no encontrado");
    }
    const indicator = await this.indicatorService.findOne(indicatorID);

    if (!indicator) {
      throw new BadRequestException("Indicador ingresados no existe");
    }

    const criteria = await this.criteriaRepository.find({
      where: {
        id: In(criteriaID),
      },
    });

    if (criteria.length !== updateCategoryDto.criteriaID.length) {
      throw new BadRequestException("Alguno de los criterios ingresados no existe");
    }

    await this.updateCriteriaInCategory(id, criteriaID);

    const result = await this.categoryRepository.update(id, { ...data, indicator: indicator });

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

  async updateCriteriaInCategory(categoryId: number, newCriteriaIds: number[]) {
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
      relations: ["criteria"],
    });

    const newCriterias = await this.criteriaRepository.find({ where: { id: In(newCriteriaIds) } });

    for (let c of newCriterias) category.criteria.push(c);
    // Filtra los criterios que ya no están presentes
    category.criteria = category.criteria.filter((c) => newCriteriaIds.includes(c.id));

    // Guarda la categoría
    await this.categoryRepository.save(category);
  }
}
