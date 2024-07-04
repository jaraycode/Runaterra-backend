import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateSettingDto } from "../dto/create-setting.dto";
import { UpdateSettingDto } from "../dto/update-setting.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { ContributionSettings } from "../entities/contributionSettings.entity";
import { Equal, Repository } from "typeorm";
import { UserActiveInterface } from "@src/common/interface/user.active.interface";
import { User } from "@src/core/users/entities/user.entity";
import { Setting } from "../entities/setting.entity";

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Setting)
    private readonly settingsRepository: Repository<Setting>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createSettingDto: CreateSettingDto, user: UserActiveInterface) {
    const activeUser = await this.userRepository.findOne({
      where: { id: Equal[user.id] },
    });

    if (!activeUser) {
      throw new NotFoundException("No existe ese usuario");
    }

    const settings = await this.settingsRepository.create(createSettingDto);
    await this.settingsRepository.save(settings);
  }

  findAll() {
    return `This action returns all settings`;
  }

  findOne(id: number) {
    return `This action returns a #${id} setting`;
  }

  update(id: number, updateSettingDto: UpdateSettingDto) {
    return `This action updates a #${id} setting`;
  }

  remove(id: number) {
    return `This action removes a #${id} setting`;
  }
}
