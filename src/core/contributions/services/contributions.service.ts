import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateContributionDto } from "../dto/create-contribution.dto";
import { UpdateContributionDto } from "../dto/update-contribution.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Contribution } from "../entities/contribution.entity";
import { Repository } from "typeorm";
import { FilesService } from "@src/core/files/service/files.service";
import { PageOptionsContributionDto } from "../dto/pageOptionsContribution.dto";
import { PageDto } from "@src/common/dto/page.dto";
import { PageMetaDto } from "@src/common/dto/page.meta.dto";

@Injectable()
export class ContributionsService {
  constructor(
    @InjectRepository(Contribution)
    private readonly contributionReposiroty: Repository<Contribution>,
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

    const newcontribution = await this.contributionReposiroty.create(data);
    await this.contributionReposiroty.save(newcontribution);

    const contribution = await this.contributionReposiroty.findOne({ where: { id: newcontribution.id } });

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

  async findAll(pageOptionsDto: PageOptionsContributionDto): Promise<PageDto<Contribution>> {
    const queryBuilder = await this.contributionReposiroty.createQueryBuilder("contribution");

    queryBuilder.leftJoinAndSelect("contribution.files", "files");
    queryBuilder.leftJoinAndSelect("contribution.user", "user");
    queryBuilder
      .orderBy("contribution.createAt", pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    if (pageOptionsDto.indicatorId) {
      queryBuilder.where("contribution.indicator = :indicator", { indicator: pageOptionsDto.indicatorId });
    }

    if (pageOptionsDto.dptoId) {
      queryBuilder.where("contribution.dpto = :dpto", { dpto: pageOptionsDto.dptoId });
    }

    if (pageOptionsDto.categoryId) {
      queryBuilder.where("contribution.category = :category", { category: pageOptionsDto.categoryId });
    }

    if (pageOptionsDto.createAt) {
      queryBuilder.where("contribution.createAt > :createAt", { createAt: pageOptionsDto.createAt });
    }

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async findOne(id: number): Promise<Contribution> {
    return await this.contributionReposiroty.findOne({ where: { id }, relations: ["files"] });
  }

  async findOneByUUID(uuid: string) {
    return await this.contributionReposiroty.findOne({ where: { uuid }, relations: ["files"] });
  }

  async update(uuid: string, updateContributionDto: UpdateContributionDto): Promise<Contribution> {
    const contributionByUUID = this.findOneByUUID(uuid);

    if (!contributionByUUID) {
      throw new NotFoundException("No existe esa contribución");
    }

    const { file, files, link, ...rest } = updateContributionDto;
    const result = await this.contributionReposiroty
      .createQueryBuilder()
      .update(rest)
      .where("uuid = :uuid", { uuid })
      .execute();

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

    const result = await this.contributionReposiroty.softDelete(id);

    if (result.affected === 0) {
      throw new NotFoundException("La actualización de la contribución no se pudo realizar");
    }

    return;
  }
}
