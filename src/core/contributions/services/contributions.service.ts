import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
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
import { SettingsService } from "@src/core/settings/service/settings.service";

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
    private readonly settingService: SettingsService,
  ) {}
  async create(createContributionDto: CreateContributionDto, user: UserActiveInterface) {
    const today = new Date();
    const settingsContribution = await this.settingService.findAll();
    if (
      !settingsContribution ||
      settingsContribution === undefined ||
      settingsContribution.length === 0 ||
      settingsContribution === null
    ) {
      throw new BadRequestException("Configuraciones inexistentes");
    }

    if (
      this.settingService.verifyDates(
        new Date(today.toISOString()),
        new Date(settingsContribution[0].contributionSettings.endDate),
      )
    ) {
      throw new BadRequestException("Fecha no disponible para subir nuevos aportes");
    }

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

    return await this.findOneByUUID(contribution.uuid);
  }

  async findAll(pageOptionsDto: PageOptionsContributionDto): Promise<PageDto<Contribution>> {
    try {
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
        queryBuilder.andWhere("indicator.id = :indicator", { indicator: pageOptionsDto.indicatorId });
      }

      if (pageOptionsDto.dptoId) {
        queryBuilder.andWhere("user.department.id = :department", { department: pageOptionsDto.dptoId });
      }

      if (pageOptionsDto.criteriaId) {
        queryBuilder.andWhere("criteria.id = :criteria", { criteria: pageOptionsDto.criteriaId });
      }

      if (pageOptionsDto.categoryId) {
        queryBuilder.andWhere("contribution.category = :category", { category: pageOptionsDto.categoryId });
      }

      if (pageOptionsDto.createAt) {
        queryBuilder.andWhere("contribution.createAt > :createAt", { createAt: pageOptionsDto.createAt });
      }

      const itemCount = await queryBuilder.getCount();
      const { entities } = await queryBuilder.getRawAndEntities();
      const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

      return new PageDto(entities, pageMetaDto);
    } catch (error) {
      console.log(error);
      throw new error();
    }
  }

  async findMyContribution(
    pageOptionsDto: PageOptionsContributionDto,
    user: UserActiveInterface,
  ): Promise<PageDto<Contribution>> {
    const queryBuilder = await this.contributionReposiroty.createQueryBuilder("contribution");

    queryBuilder.leftJoinAndSelect("contribution.files", "files");
    queryBuilder.leftJoinAndSelect("contribution.user", "user");
    queryBuilder.leftJoinAndSelect("contribution.category", "category");
    queryBuilder.leftJoinAndSelect("user.department", "department");
    queryBuilder.leftJoinAndSelect("category.indicator", "indicator");
    queryBuilder.leftJoinAndSelect("category.criteria", "criteria");

    queryBuilder
      .where("user.id = :user", { user: user.id })
      .orderBy("contribution.createAt", pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    if (pageOptionsDto.indicatorId) {
      queryBuilder.andWhere("indicator.id = :indicator", { indicator: pageOptionsDto.indicatorId });
    }

    if (pageOptionsDto.dptoId) {
      queryBuilder.andWhere("user.department.id = :department", { department: pageOptionsDto.dptoId });
    }

    if (pageOptionsDto.criteriaId) {
      queryBuilder.andWhere("criteria.id = :criteria", { criteria: pageOptionsDto.criteriaId });
    }

    if (pageOptionsDto.categoryId) {
      queryBuilder.andWhere("contribution.category = :category", { category: pageOptionsDto.categoryId });
    }

    if (pageOptionsDto.createAt) {
      queryBuilder.andWhere("contribution.createAt > :createAt", { createAt: pageOptionsDto.createAt });
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
    return await this.contributionReposiroty.findOne({
      where: { uuid },
      relations: ["files", "category", "category.indicator"],
    });
  }

  async update(uuid: string, updateContributionDto: UpdateContributionDto, user: UserActiveInterface) {
    const today = new Date();
    const settingsContribution = await this.settingService.findAll();
    if (!settingsContribution) {
      throw new BadRequestException("Configuraciones inexistentes");
    }

    if (
      this.settingService.verifyDates(
        new Date(today.toISOString()),
        new Date(settingsContribution[0].contributionSettings.endDate),
      )
    ) {
      throw new BadRequestException("Fecha no disponible para subir nuevos aportes");
    }

    const activeUser = await this.userRepository.findOne({
      where: { id: Equal(user.id) },
      relations: ["contributions"],
    });

    if (!activeUser) {
      throw new NotFoundException("No existe ese usuario");
    }

    const contributionByUUID = await this.findOneByUUID(uuid);

    if (!contributionByUUID) {
      throw new NotFoundException("No existe esa contribución");
    }
    // ? Idea, VERIFICAR QUE LINKS Y ARCHIVOS TENGA LA MISMA CANTIDAD DE DATOS Y AGREGAR LOS QUE ESTÉN NUEVOS Y QUITAR LOS QUE NO APARECEN EN LOS ÚLTIMOS DATOS ENVIADOS
    let { file, files, link, ...rest } = updateContributionDto;

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

    if (files && file) {
      const unifiedFiles = files.map((fileItem, index) => {
        return {
          name: file[index].name,
          description: file[index].description,
          file: fileItem,
          contribution: contributionByUUID,
        };
      });

      await Promise.all(contributionByUUID.files.map((fileItem) => this.filesService.remove(fileItem.id)));

      await Promise.all(unifiedFiles.map((fileItem) => this.filesService.create(fileItem)));
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
