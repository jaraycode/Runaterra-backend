import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateContributionDto } from "../dto/create-contribution.dto";
import { UpdateContributionDto } from "../dto/update-contribution.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Contribution } from "../entities/contribution.entity";
import { Repository } from "typeorm";
import { FilesService } from "@src/core/files/service/files.service";
import { CreateFileDto } from "@src/core/files/dto/create-file.dto";

@Injectable()
export class ContributionsService {
  constructor(
    @InjectRepository(Contribution)
    private readonly contributionReposiroty: Repository<Contribution>,
    private readonly filesService: FilesService,
  ) {}
  async create(createContributionDto: CreateContributionDto): Promise<Contribution> {
    const { files, ...rest } = createContributionDto;

    const { file: dataFile, ...data } = rest;
    const newcontribution = await this.contributionReposiroty.create(data);
    await this.contributionReposiroty.save(newcontribution);

    const contribution = await this.contributionReposiroty.findOne({ where: { id: newcontribution.id } });

    const dataFileString = JSON.stringify(dataFile, null, 2);

    return contribution;
  }

  async findAll(): Promise<Contribution[]> {
    return await this.contributionReposiroty.find();
  }

  async findOne(id: number): Promise<Contribution> {
    return await this.contributionReposiroty.findOne({ where: { id } });
  }

  async update(id: number, updateContributionDto: UpdateContributionDto): Promise<Contribution> {
    const { files, ...data } = updateContributionDto;
    const result = await this.contributionReposiroty.update(id, data);

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
