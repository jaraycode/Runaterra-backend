import { BadRequestException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Files } from "../entities/file.entity";
import { Repository, Equal } from "typeorm";
import { envData } from "@src/config/typeorm";
import { deleteFile } from "@src/utils/fileManager";
import * as path from "path";
import { PutFileFormattedDto } from "../dto/put-file-formatted-dto";
import { Contribution } from "@src/core/contributions/entities/contribution.entity";

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(Files)
    private readonly filesRepository: Repository<Files>,
  ) {}

  async createOrUpdate(createFileDto: PutFileFormattedDto, contribution: Contribution): Promise<Files> {
    let fileToModify = new Files();

    //console.log("createFileDto", createFileDto);
    if (!!createFileDto.id) {
      const fileExists = await this.findOne(createFileDto.id);
      if (fileExists) {
        fileToModify = fileExists;
      }
    }

    const { name, description } = createFileDto;

    fileToModify.name = name;
    fileToModify.description = description;

    if (createFileDto.file) {
      fileToModify.path = envData.BACKEND_URL + "public/" + createFileDto.file.fileNameFull;
      fileToModify.size = createFileDto.file.fileSize;
      fileToModify.type = createFileDto.file.mimetype;
      await createFileDto.file.save();
    }

    fileToModify.contribution = contribution;

    return await this.filesRepository.save(fileToModify);
  }

  async findAll() {
    return await this.filesRepository.find();
  }

  async findOne(id: number) {
    return await this.filesRepository.findOne({
      where: { id },
    });
  }

  async getFilesFromContribution(contribution: Contribution): Promise<Files[]> {
    return await this.filesRepository.find({
      where: {
        contribution: {
          id: Equal(contribution.id),
        },
      },
    });
  }

  async remove(id: number) {
    const file = await this.filesRepository.findOne({
      where: { id },
    });

    if (!file) {
      throw new BadRequestException("El archivo que intenta eliminar no existe");
    }

    if (file.path) {
      const url = new URL(file.path);
      let filePathPrincipal = url.pathname;
      if (filePathPrincipal.startsWith("/")) {
        filePathPrincipal = filePathPrincipal.substring(1);
      }
      let fileName = path.basename(file.path);
      await deleteFile(filePathPrincipal, fileName);
    }

    await this.filesRepository.delete(id);

    return { status: HttpStatus.OK, message: "Archivo eliminado con exito" };
  }
}
