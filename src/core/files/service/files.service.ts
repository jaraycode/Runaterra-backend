import { BadRequestException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateFileDto } from "../dto/create-file.dto";
import { UpdateFileDto } from "../dto/update-file.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Files } from "../entities/file.entity";
import { Repository } from "typeorm";
import { envData } from "@src/config/typeorm";
import { deleteFile } from "@src/utils/fileManager";
import * as path from "path";
@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(Files)
    private readonly filesRepository: Repository<Files>,
  ) {}

  async create(createFileDto: CreateFileDto) {
    const { name, description, file, contribution } = createFileDto;
    console.log(contribution);

    const newFile = new Files();
    newFile.name = name;
    newFile.description = description;
    newFile.path = envData.BACKEND_URL + "public/" + file.fileNameFull;
    newFile.size = file.fileSize;
    newFile.type = file.fileExtension;
    newFile.contribution = contribution;

    file.save();

    return await this.filesRepository.save(newFile);
  }

  async findAll() {
    return await this.filesRepository.find();
  }

  async findOne(id: number) {
    return await this.filesRepository.findOne({
      where: { id },
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
