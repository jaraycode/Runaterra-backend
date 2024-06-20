import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateIndicatorDto } from "../dto/create-indicator.dto";
import { UpdateIndicatorDto } from "../dto/update-indicator.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Indicator } from "../entities/indicator.entity";
import { Repository } from "typeorm";
import { PageOptionsDto } from "@src/common/dto/pageOptions.dto";
import { PageMetaDto } from "@src/common/dto/page.meta.dto";
import { PageDto } from "@src/common/dto/page.dto";

@Injectable()
export class IndicatorsService {
  constructor(@InjectRepository(Indicator) private readonly indicatorRepository: Repository<Indicator>) {}

  async create(createIndicatorDto: CreateIndicatorDto): Promise<Indicator> {
    return await this.indicatorRepository.save(createIndicatorDto);
  }
  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<Indicator>> {
    const queryBuilder = await this.indicatorRepository.createQueryBuilder("indicator");

    queryBuilder.leftJoinAndSelect("indicator.criteria", "criteria");
    queryBuilder.orderBy("indicator.index", pageOptionsDto.order).skip(pageOptionsDto.skip).take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async findAllWithoutPagination(): Promise<Indicator[]> {
    return await this.indicatorRepository.find({ relations: ["criteria", "cateogories"] });
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
