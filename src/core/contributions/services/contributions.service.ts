import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateContributionDto } from "../dto/create-contribution.dto";
import { UpdateContributionDto } from "../dto/update-contribution.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Contribution } from "../entities/contribution.entity";
import { Equal, Repository } from "typeorm";
import { FilesService } from "@src/core/files/service/files.service";
import { PageOptionsContributionDto } from "../dto/pageOptionsContribution.dto";
import { PageDto } from "@src/common/dto/page.dto";
import { PageMetaDto } from "@src/common/dto/page.meta.dto";
import { Category } from "@src/core/categories/entities/category.entity";
import { User } from "@src/core/users/entities/user.entity";
import { UserActiveInterface } from "@src/common/interface/user.active.interface";
import { Link } from "../entities/link.entity";

@Injectable()
export class ContributionsService {
  constructor(
    @InjectRepository(Contribution)
    private readonly contributionReposiroty: Repository<Contribution>,
    private readonly filesService: FilesService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}
  async create(createContributionDto: CreateContributionDto, user: UserActiveInterface): Promise<Contribution> {
    let { files, file, categoryId, indicatorID, ...data } = createContributionDto;

    const activeUser = await this.userRepository.findOne({
      where: { id: Equal(user.id) },
      relations: ["contributions"],
    });

    if (!activeUser) {
      throw new NotFoundException("No existe ese usuario");
    }

    const category = await this.categoryRepository.findOne({
      where: { id: Equal(categoryId) },
      relations: ["contribution"],
    });

    if (!category) {
      throw new NotFoundException("No existe esa categoría");
    }

    if (!files || !file) {
      throw new NotFoundException("No se encontraron archivos");
    }

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

    const contribution = await this.contributionReposiroty.findOne({ where: { id: Equal(newcontribution.id) } });

    const unifiedFiles = files.map((fileItem, index) => {
      return {
        name: file[index].name,
        description: file[index].description,
        file: fileItem,
        contribution: contribution,
      };
    });

    await Promise.all(unifiedFiles.map((fileItem) => this.filesService.create(fileItem)));

    category.contribution.push(contribution);

    activeUser.contributions.push(contribution);

    await this.categoryRepository.save(category);

    await this.userRepository.save(activeUser);

    return contribution;
  }

  async findAll(pageOptionsDto: PageOptionsContributionDto): Promise<PageDto<Contribution>> {
    const queryBuilder = await this.contributionReposiroty.createQueryBuilder("contribution");

    queryBuilder.leftJoinAndSelect("contribution.files", "files");
    queryBuilder.leftJoinAndSelect("contribution.user", "user");
    queryBuilder.leftJoinAndSelect("contribution.category", "category");
    queryBuilder.leftJoinAndSelect("user.department", "department");
    queryBuilder.leftJoinAndSelect("category.indicator", "indicator");
    queryBuilder.leftJoinAndSelect("category.criteria", "criteria");

    queryBuilder
      .orderBy("contribution.createAt", pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    if (pageOptionsDto.indicatorId) {
      queryBuilder.where("indicator.id = :indicator", { indicator: pageOptionsDto.indicatorId });
    }

    if (pageOptionsDto.dptoId) {
      queryBuilder.where("user.department = :department", { dpto: pageOptionsDto.dptoId });
    }

    if (pageOptionsDto.criteriaId) {
      queryBuilder.where("criteria.id = :criteria", { criteria: pageOptionsDto.criteriaId });
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
    const contributionByUUID = await this.findOneByUUID(uuid);

    if (!contributionByUUID) {
      throw new NotFoundException("No existe esa contribución");
    }
    // ? Idea, VERIFICAR QUE LINKS Y ARCHIVOS TENGA LA MISMA CANTIDAD DE DATOS Y AGREGAR LOS QUE ESTÉN NUEVOS Y QUITAR LOS QUE NO APARECEN EN LOS ÚLTIMOS DATOS ENVIADOS
    const { file, files, link, ...rest } = updateContributionDto;

    const links: Link[] = [];

    for (let l of link) links.push(l);

    const result = await this.contributionReposiroty
      .createQueryBuilder()
      .update({ ...rest, link: links })
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
