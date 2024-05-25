import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateIndicatorDto } from "../dto/create-indicator.dto";
import { UpdateIndicatorDto } from "../dto/update-indicator.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Indicator } from "../entities/indicator.entity";
import { Repository } from "typeorm";

@Injectable()
export class IndicatorsService {
  constructor(@InjectRepository(Indicator) private readonly indicatorRepository: Repository<Indicator>) {}

  async create(createIndicatorDto: CreateIndicatorDto): Promise<Indicator> {
    return await this.indicatorRepository.save(createIndicatorDto);
  }
  // TODO: Pendiente por realizar paginación
  async findAll(): Promise<Indicator[]> {
    return await this.indicatorRepository.find();
  }

  async findOne(id: number): Promise<Indicator> {
    return await this.indicatorRepository.findOne({ where: { id } });
  }

  async update(id: number, updateIndicatorDto: UpdateIndicatorDto) {
    const indicator = await this.findOne(id);

    if (!indicator) {
      throw new NotFoundException("Indicador no encontrado");
    }

    const response = await this.indicatorRepository.update(id, updateIndicatorDto);

    if (response.affected === 0) {
      throw new NotFoundException("La actualización del indicador no se pudo realizar");
    }

    return await this.findOne(id);
  }

  async remove(id: number) {
    const indicator = await this.findOne(id);

    if (!indicator) {
      throw new NotFoundException("Indicador no encontrado");
    }

    const response = await this.indicatorRepository.softDelete(id);

    if (response.affected === 0) {
      throw new NotFoundException("La eliminación del indicador no se pudo realizar");
    }

    return;
  }
}