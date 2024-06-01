import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateContributionDto } from "../dto/create-contribution.dto";
import { UpdateContributionDto } from "../dto/update-contribution.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Contribution } from "../entities/contribution.entity";
import { Repository } from "typeorm";

@Injectable()
export class ContributionsService {
  constructor(
    @InjectRepository(Contribution)
    private readonly contributionReposiroty: Repository<Contribution>,
  ) {}
  async create(createContributionDto: CreateContributionDto): Promise<Contribution> {
    return await this.contributionReposiroty.save(createContributionDto);
  }

  async findAll(): Promise<Contribution[]> {
    return await this.contributionReposiroty.find();
  }

  async findOne(id: number): Promise<Contribution> {
    return await this.contributionReposiroty.findOne({ where: { id } });
  }

  async update(id: number, updateContributionDto: UpdateContributionDto): Promise<Contribution> {
    const result = await this.contributionReposiroty.update(id, updateContributionDto);

    if (result.affected === 0) {
      throw new NotFoundException("La actualización de la contribución no se pudo realizar");
    }

    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const contribution = await this.findOne(id);

    if (!contribution) {
      throw new NotFoundException("No se encontró la contribución");
    }

    const result = await this.contributionReposiroty.softDelete(id);

    if (result.affected === 0) {
      throw new NotFoundException("La actualización de la contribución no se pudo realizar");
    }

    return;
  }
}
