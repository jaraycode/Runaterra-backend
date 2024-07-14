import { BadRequestException } from "@nestjs/common";
import { CreateContributionDto } from "./dto/create-contribution.dto";
import { UpdateContributionDto } from "./dto/update-contribution.dto";
import { CreateFileDto } from "@src/core/files/dto/create-file.dto";
import {
  handleContributionDtoFileField,
  handleContributionDtoLinkField,
} from "@src/utils/transformer-multipart-formdata";
import { UpdateFileDto } from "../files/dto/update-file.dto";
import { PutFileFormattedDto } from "../files/dto/put-file-formatted-dto";
import { FileData } from "nestjs-formdata-interceptor";
import { PutFormattedContributionDto } from "./dto/put-formatted-contribution.dto";

export function getFormattedPutContributionDto(
  originalDto: CreateContributionDto | UpdateContributionDto,
): PutFormattedContributionDto {
  return {
    uuid: originalDto.uuid,
    description: originalDto.description,
    link: handleContributionDtoLinkField(originalDto.link),
    categoryId: originalDto.categoryId,
    indicatorID: originalDto.indicatorID,
    files: getFormattedFilesDto(handleContributionDtoFileField(originalDto.file), originalDto.files),
  };
}

export function getFormattedFilesDto(
  createFilesDto: CreateFileDto[] | UpdateFileDto[],
  _filesUploaded: FileData[] | FileData,
): PutFileFormattedDto[] {
  const filesUploaded = _filesUploaded ? (Array.isArray(_filesUploaded) ? _filesUploaded : [_filesUploaded]) : [];
  // Unificamos / Formateamos los archivos
  let indexFilesUploadedAddeds = 0; /* <--- esto no deberia ser necesario 
      si los .name coinciden, pero no confiemos en el frontend
     */

  const unifiedFiles: PutFileFormattedDto[] = createFilesDto.map((fileItem: CreateFileDto | UpdateFileDto) => {
    if (!!(fileItem as any).id) {
      const _fileItemEdited: UpdateFileDto = fileItem as UpdateFileDto;
      return {
        id: _fileItemEdited.id,
        name: _fileItemEdited.name,
        description: _fileItemEdited.description,
      };
    }

    // Primero buscamos por coincidencia de nombres
    let _fileUploaded: FileData | null = filesUploaded.find(
      (uploadedFileData) =>
        uploadedFileData.fileNameFull === fileItem.name || uploadedFileData.originalFileName === fileItem.name,
    );
    if (!_fileUploaded) {
      // Si no lo encontro con la coincidencia de nombres entonces ok, hacemos por indice
      _fileUploaded = filesUploaded[indexFilesUploadedAddeds];
    }
    if (!_fileUploaded) {
      // Si aqui ya no se encontro, nos jodimos
      throw new BadRequestException("No se encontró el archivo subido para el fileData especificado");
    }
    indexFilesUploadedAddeds++;

    return {
      name: fileItem.name,
      description: fileItem.description,
      file: _fileUploaded,
    };
  });

  return unifiedFiles;
}
