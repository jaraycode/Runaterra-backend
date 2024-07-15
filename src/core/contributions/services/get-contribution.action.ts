import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Contribution } from "../entities/contribution.entity";
import { Repository } from "typeorm";

@Injectable()
export class GetContributionAction {
  constructor(
    @InjectRepository(Contribution)
    private readonly contributionReposiroty: Repository<Contribution>,
  ) {}

  async findOne(id: number): Promise<Contribution> {
    return await this.contributionReposiroty.findOne({
      where: { id },
      relations: ["files", "category", "category.indicator"],
    });
  }

  async findOneByUUID(uuid: string) {
    return await this.contributionReposiroty.findOne({
      where: { uuid },
      relations: ["files", "category", "category.indicator"],
    });
  }
}
