import { Injectable } from "@nestjs/common";
import { CreateDptoDto } from "../dto/create-dpto.dto";
import { UpdateDptoDto } from "../dto/update-dpto.dto";
import { Dpto } from "../entities/dpto.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class DptosService {
  constructor(
    @InjectRepository(Dpto)
    private readonly dptoRepository: Repository<Dpto>,
  ) {}

  async create(createDptoDto: CreateDptoDto): Promise<Dpto> {
    const newDpto = new Dpto();
    newDpto.nombre = createDptoDto.name;
    return await this.dptoRepository.save(newDpto);
  }

  async findAll(): Promise<Dpto[]> {
    return this.dptoRepository.find();
  }

  async findOne(id: number): Promise<Dpto> {
    return this.dptoRepository.findOne({ where: { id } });
  }

  async update(id: number, updateDptoDto: UpdateDptoDto) {
    return `This action updates a #${id} dpto`;
  }

  async remove(id: number) {
    return `This action removes a #${id} dpto`;
  }
}
