import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateContributionDto } from "../dto/create-contribution.dto";
import { UpdateContributionDto } from "../dto/update-contribution.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Contribution } from "../entities/contribution.entity";
import { Repository } from "typeorm";
import { FilesService } from "@src/core/files/service/files.service";

@Injectable()
export class ContributionsService {
  constructor(
    @InjectRepository(Contribution)
    private readonly contributionRepository: Repository<Contribution>,
    private readonly filesService: FilesService,
  ) {}
  async create(createContributionDto: CreateContributionDto): Promise<Contribution> {
    let { files, file, ...data } = createContributionDto;

    if (files && !Array.isArray(files)) {
      files = [files];
    }
    if (file && !Array.isArray(file)) {
      file = [file];
    }

    if (files && file) {
      if (files.length !== file.length) {
        throw new Error("Los arreglos 'files' y 'file' deben tener la misma longitud");
      }
    }

    const newcontribution = await this.contributionRepository.create(data);
    await this.contributionRepository.save(newcontribution);

    const contribution = await this.contributionRepository.findOne({ where: { id: newcontribution.id } });

    const unifiedFiles = files.map((fileItem, index) => {
      return {
        name: file[index].name,
        description: file[index].description,
        file: fileItem,
        contribution: contribution,
      };
    });

    await Promise.all(unifiedFiles.map((fileItem) => this.filesService.create(fileItem)));

    return contribution;
  }

  async findAll(): Promise<Contribution[]> {
    return await this.contributionRepository.find({
      relations: ["files"],
    });
  }

  async findOne(id: number): Promise<Contribution> {
    return await this.contributionRepository.findOne({ where: { id }, relations: ["files"] });
  }

  async findOneByUUID(uuid: string) {
    return await this.contributionRepository.findOne({ where: { uuid }, relations: ["files"] });
  }

  async update(uuid: string, updateContributionDto: UpdateContributionDto): Promise<Contribution> {
    const contributionByUUID = this.findOneByUUID(uuid);

    if (!contributionByUUID) {
      throw new NotFoundException("No existe esa contribución");
    }

    const { file, files, link, ...rest } = updateContributionDto;
    const result = await this.contributionRepository
      .createQueryBuilder()
      .update(rest)
      .where("uuid = :uuid", { uuid })
      .execute();
    //const result = await this.contributionReposiroty.update(uuid, rest);

    if (result.affected === 0) {
      throw new NotFoundException("La actualización de la contribución no se pudo realizar");
    }

    return await this.findOneByUUID(uuid);
  }

  async remove(id: number): Promise<void> {
    const contribution = await this.findOne(id);

    if (!contribution) {
      throw new NotFoundException("No se encontró la contribución");
    }

    const result = await this.contributionRepository.softDelete(id);

    if (result.affected === 0) {
      throw new NotFoundException("La actualización de la contribución no se pudo realizar");
    }

    return;
  }
}
