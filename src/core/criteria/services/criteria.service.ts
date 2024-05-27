import { CreateCriteriaDto } from "../dto/create-criteria.dto";
import { UpdateCriteriaDto } from "../dto/update-criteria.dto";
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Criteria } from "../entities/criteria.entity";
import { Repository } from "typeorm";
import { IndicatorsService } from "@src/core/indicators/services/indicators.service";
import { Indicator } from "@src/core/indicators/entities/indicator.entity";

@Injectable()
export class CriteriaService {
  constructor(
    @InjectRepository(Criteria)
    private readonly criteriaRepository: Repository<Criteria>,
    private readonly indicatorService: IndicatorsService,
  ) {}

  async create(createCriteriaDto: CreateCriteriaDto): Promise<Criteria> {
    const indicator = await this.indicatorService.findOne(createCriteriaDto.indicatorID);

    if (!indicator) {
      throw new BadRequestException("El indicador no existe");
    }

    const newCriteria = await this.criteriaRepository.create({ ...createCriteriaDto, indicator: indicator });

    await this.criteriaRepository.save(newCriteria);
    return newCriteria;
  }

  // TODO: pagination
  async findAll(): Promise<Criteria[]> {
    return await this.criteriaRepository.find();
  }

  async findOne(id: number): Promise<Criteria> {
    return await this.criteriaRepository.findOne({ where: { id } });
  }

  async update(id: number, updateCriteriaDto: UpdateCriteriaDto): Promise<Criteria> {
    const criteria = await this.findOne(id);

    if (!criteria) {
      throw new NotFoundException("Criterio no encontrado");
    }

    const result = await this.criteriaRepository.update(id, updateCriteriaDto);

    if (result.affected === 0) {
      throw new NotFoundException("La actualización del criterio no se pudo realizar");
    }
    return await this.findOne(id); // returning the updated row
  }

  async remove(id: number): Promise<void> {
    const criteria = await this.findOne(id);

    if (!criteria) {
      throw new NotFoundException("Criterio no encontrado");
    }

    const result = await this.criteriaRepository.softDelete(id);

    if (result.affected === 0) {
      throw new NotFoundException("La eliminación del criterio no se pudo realizar");
    }
    return;
  }
}
