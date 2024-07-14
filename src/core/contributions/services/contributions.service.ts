import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateContributionDto } from "../dto/create-contribution.dto";
import { UpdateContributionDto } from "../dto/update-contribution.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Contribution } from "../entities/contribution.entity";
import { Equal, Repository } from "typeorm";
import { PageOptionsContributionDto } from "../dto/pageOptionsContribution.dto";
import { PageDto } from "@src/common/dto/page.dto";
import { PageMetaDto } from "@src/common/dto/page.meta.dto";
import { Category } from "@src/core/categories/entities/category.entity";
import { User } from "@src/core/users/entities/user.entity";
import { UserActiveInterface } from "@src/common/interface/user.active.interface";
import { PutContributionAction } from "./put-contribution.action";
import { GetContributionAction } from "./get-contribution.action";
import { PutFormattedContributionDto } from "../dto/put-formatted-contribution.dto";

@Injectable()
export class ContributionsService {
  constructor(
    @InjectRepository(Contribution)
    private readonly contributionReposiroty: Repository<Contribution>,
    private readonly getContributionAction: GetContributionAction,
    private readonly putContributionAction: PutContributionAction,
  ) {}

  async create(createContributionDto: PutFormattedContributionDto, user: UserActiveInterface) {
    return await this.putContributionAction.create(createContributionDto, user);
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
    return await this.getContributionAction.findOne(id);
  }

  async findOneByUUID(uuid: string) {
    return await this.getContributionAction.findOneByUUID(uuid);
  }

  async update(uuid: string, updateContributionDto: PutFormattedContributionDto, user: UserActiveInterface) {
    return await this.putContributionAction.update(uuid, updateContributionDto, user);
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
