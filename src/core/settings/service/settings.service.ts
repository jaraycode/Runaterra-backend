import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateSettingDto } from "../dto/create-setting.dto";
import { UpdateSettingDto } from "../dto/update-setting.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Equal, Repository } from "typeorm";
import { UserActiveInterface } from "@src/common/interface/user.active.interface";
import { User } from "@src/core/users/entities/user.entity";
import { Setting } from "../entities/setting.entity";
import { isAfter } from "@formkit/tempo";

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
    const { contributionSettings, ...data } = createSettingDto;

    const { initDate, endDate, ...dataContributions } = contributionSettings;

    const initDateISO = new Date(initDate);
    const endDateISO = new Date(endDate);

    if (this.verifyDates(new Date(initDateISO.toISOString()), new Date(endDateISO.toISOString())))
      throw new BadRequestException("Begin date is after deadline");

    const settings = await this.settingsRepository.create({
      ...data,
      contributionSettings: { ...dataContributions, initDate: initDate, endDate: endDate },
    });
    await this.settingsRepository.save(settings);
  }

  async findAll() {
    return await this.settingsRepository.find();
  }

  async findOne(id: string): Promise<Setting> {
    const setting = await this.settingsRepository.findOne({ where: { key: Equal[id] } });
    return setting;
  }

  async update(id: string, updateSettingDto: UpdateSettingDto, user: UserActiveInterface) {
    const activeUser = await this.userRepository.findOne({
      where: { id: Equal[user.id] },
    });

    if (!activeUser) {
      throw new NotFoundException("No existe ese usuario");
    }

    const contributionSet = await this.findOne(id);

    if (!contributionSet) throw new NotFoundException("Settings not found");

    const today = new Date();

    const { initDate, endDate } = updateSettingDto.contributionSettings;

    const initDateISO = new Date(initDate);
    const endDateISO = new Date(endDate);

    if (this.verifyDates(new Date(today.toISOString()), new Date(endDateISO.toISOString())))
      throw new BadRequestException("Dates are before today's date");

    if (this.verifyDates(new Date(initDateISO.toISOString()), new Date(endDateISO.toISOString())))
      throw new BadRequestException("Begin date is after deadline");

    const result = await this.settingsRepository
      .createQueryBuilder()
      .update(updateSettingDto)
      .where("key = :id", { id })
      .execute();

    if (result.affected === 0) throw new NotFoundException("La actualización no se pudo realizar");

    return await this.findOne(id);
  }

  async remove(id: string) {
    const contributionSet = await this.findOne(id);

    if (!contributionSet) throw new NotFoundException("Settings not found");

    const result = await this.settingsRepository.createQueryBuilder().softDelete().where("key = :id", { id }).execute();

    if (result.affected === 0) throw new NotFoundException("La eliminación no se pudo realizar");

    return;
  }

  verifyDates(initDate: Date, endDate: Date): boolean {
    return isAfter(initDate, endDate);
  }
}
