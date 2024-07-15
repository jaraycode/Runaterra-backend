import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateContributionDto } from "../dto/create-contribution.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Contribution } from "../entities/contribution.entity";
import { Equal, Repository } from "typeorm";
import { FilesService } from "@src/core/files/service/files.service";
import { Category } from "@src/core/categories/entities/category.entity";
import { User } from "@src/core/users/entities/user.entity";
import { UserActiveInterface } from "@src/common/interface/user.active.interface";
import { SettingsService } from "@src/core/settings/service/settings.service";
import { GetContributionAction } from "./get-contribution.action";
import { Setting } from "@src/core/settings/entities/setting.entity";
import { PutFormattedContributionDto } from "../dto/put-formatted-contribution.dto";
import { Indicator } from "@src/core/indicators/entities/indicator.entity";
import { UserRole } from "@src/constants";
import { MailsService } from "@src/core/mails/service/mails.service";

@Injectable()
export class PutContributionAction {
  constructor(
    @InjectRepository(Contribution)
    private readonly contributionReposiroty: Repository<Contribution>,
    private readonly filesService: FilesService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Indicator)
    private readonly indicatorRepository: Repository<Indicator>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly settingService: SettingsService,
    private readonly getContributionAction: GetContributionAction,
    private readonly mailService: MailsService,
  ) {}

  private async getSettingsOrThrowWheNotExists(): Promise<Setting[]> {
    const settingsContribution = await this.settingService.findAll();
    if (
      !settingsContribution ||
      settingsContribution === undefined ||
      settingsContribution.length === 0 ||
      settingsContribution === null
    ) {
      throw new BadRequestException("Configuraciones inexistentes");
    }

    return settingsContribution;
  }

  private async throwWhenDateLimitReachedForSubmitContribution(): Promise<void> {
    const today = new Date();
    const settingsContribution = await this.getSettingsOrThrowWheNotExists();
    if (
      this.settingService.verifyDates(
        new Date(today.toISOString()),
        new Date(settingsContribution[0].contributionSettings.endDate),
      )
    ) {
      throw new BadRequestException("Fecha no disponible para subir nuevos aportes");
    }
  }

  private async getActiveUserOrThrow(user: UserActiveInterface): Promise<User> {
    const activeUser = await this.userRepository.findOne({
      where: { id: Equal(user.id) },
      relations: ["contributions"],
    });

    if (!activeUser) {
      throw new NotFoundException("No existe ese usuario");
    }

    return activeUser;
  }

  private async getCategoryOrThrow(categoryId: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id: Equal(categoryId) },
      relations: ["contribution"],
    });
    if (!category) {
      throw new NotFoundException("No existe esa categoría");
    }

    return category;
  }

  // Unsued
  public async getIndicatorOrThrow(indicatorID: number): Promise<Indicator> {
    const indicator = await this.indicatorRepository.findOne({
      where: { id: Equal(indicatorID) },
    });

    if (!indicator) {
      throw new NotFoundException("No existe ese indicador");
    }

    return indicator;
  }

  private findOneContribution(id: number): Promise<Contribution> {
    return this.contributionReposiroty.findOne({
      where: { id: Equal(id) },
    });
  }

  async create(createContributionDto: PutFormattedContributionDto, user: UserActiveInterface) {
    //throw new BadRequestException("Fecha no disponible para subir nuevos aportes");
    console.log("Create", createContributionDto);
    this.throwWhenDateLimitReachedForSubmitContribution();
    let { files, categoryId, indicatorID, ...data } = createContributionDto;

    const activeUser = await this.getActiveUserOrThrow(user);

    const category = await this.getCategoryOrThrow(createContributionDto.categoryId);

    // Creamos la contribucion
    const newContribution = this.contributionReposiroty.create({
      ...data,
    });

    // Relacionamos la contribucion a la category
    newContribution.category = category;
    newContribution.user = activeUser;
    // Guardamos
    await this.contributionReposiroty.save(newContribution);

    // Obtenemos la contribucion recien creada
    const contribution = await this.findOneContribution(newContribution.id);

    // Guardamos los archivos
    await Promise.all(files.map((fileItem) => this.filesService.createOrUpdate(fileItem, contribution)));

    const admins = await this.userRepository.find({
      where: { role: Equal(UserRole.ADMIN) },
    });
    console.log("------------> 8");
    let uuidSetting = `81ed6231-5be6-4166-9118-d982038a2fc7`;

    const setting = await this.settingService.findOne(uuidSetting);
    console.log("------------> 9");
    if (setting.contributionSettings.getNotificationForContribution) {
      await Promise.all(
        admins.map(async (admin) => {
          await this.mailService.sendMail({
            email: admin.email,
            subject: "Nueva contribución",
            message: `El departamento ${activeUser.department.name} ha creado una nueva contribución con uuid: ${contribution.uuid}`,
          });
        }),
      );
    }
    console.log("------------> 11");
    return await this.getContributionAction.findOneByUUID(contribution.uuid);
  }

  async update(uuid: string, updateContributionDto: PutFormattedContributionDto, user: UserActiveInterface) {
    this.throwWhenDateLimitReachedForSubmitContribution();

    const contributionByUUID = await this.getContributionAction.findOneByUUID(uuid);

    if (!contributionByUUID) {
      throw new NotFoundException("No existe esa contribución");
    }

    let { files, categoryId, indicatorID, ...data } = updateContributionDto;

    contributionByUUID.category = await this.getCategoryOrThrow(categoryId);
    contributionByUUID.user = await this.getActiveUserOrThrow(user);
    await this.contributionReposiroty.save(contributionByUUID);

    const result = await this.contributionReposiroty
      .createQueryBuilder()
      .update({ ...data })
      .where("uuid = :uuid", { uuid })
      .execute();

    if (result.affected === 0) {
      throw new NotFoundException("La actualización de la contribución no se pudo realizar");
    }

    const filesExisting = await this.filesService.getFilesFromContribution(contributionByUUID);

    console.log("input", files);
    console.log("existing", filesExisting);
    const filesUploadedsExistingInFiles = files.filter((file) => {
      return filesExisting.some((fileExisting) => fileExisting.id === file.id);
    });
    const filesToDelete = filesExisting.filter((fileExisting) => {
      return !files.some((file) => file.id === fileExisting.id);
    });
    const filesToCreate = files.filter((file) => {
      return !filesExisting.some((fileExisting) => fileExisting.id === file.id);
    });
    console.log("to create", [...filesToCreate, ...filesUploadedsExistingInFiles]);
    console.log("to dlete", filesToDelete);
    await Promise.all(
      [...filesToCreate, ...filesUploadedsExistingInFiles].map((fileItem) =>
        this.filesService.createOrUpdate(fileItem, contributionByUUID),
      ),
    );
    await Promise.all(filesToDelete.map((fileItem) => this.filesService.remove(fileItem.id)));

    return await this.getContributionAction.findOneByUUID(uuid);
  }
}
