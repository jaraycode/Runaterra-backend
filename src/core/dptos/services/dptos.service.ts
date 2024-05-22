import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateDptoDto } from "../dto/create-dpto.dto";
import { UpdateDptoDto } from "../dto/update-dpto.dto";
import { Dpto } from "../entities/dpto.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PageOptionsDto } from "@src/common/dto/pageOptions.dto";
import { PageDto } from "@src/common/dto/page.dto";
import { PageMetaDto } from "@src/common/dto/page.meta.dto";

@Injectable()
export class DptosService {
  constructor(
    @InjectRepository(Dpto)
    private readonly dptoRepository: Repository<Dpto>,
  ) {}

  async create(createDptoDto: CreateDptoDto): Promise<Dpto> {
    return await this.dptoRepository.save(createDptoDto);
  }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<Dpto>> {
    const queryBuilder = await this.dptoRepository.createQueryBuilder("dpto");

    queryBuilder.orderBy("dpto.createdAt", pageOptionsDto.order).skip(pageOptionsDto.skip).take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async findOne(id: number): Promise<Dpto> {
    return this.dptoRepository.findOne({ where: { id } });
  }

  async update(id: number, updateDptoDto: UpdateDptoDto): Promise<Dpto> {
    const department = await this.findOne(id);

    if (!department) {
      throw new NotFoundException("Departamento no encontrado");
    }

    const resultado = await this.dptoRepository.update(id, updateDptoDto);

    if (resultado.affected === 0) {
      throw new NotFoundException("La actualización del departamento no se pudo realizar");
    }

    return await this.findOne(id);
  }

  async remove(id: number) {
    const department = await this.findOne(id);

    if (!department) {
      throw new NotFoundException("Departamento no encontrado");
    }

    const resultado = await this.dptoRepository.softDelete(id);

    if (resultado.affected === 0) {
      throw new NotFoundException("La eliminación del departamento no se pudo realizar");
    }

    return;
  }
}
