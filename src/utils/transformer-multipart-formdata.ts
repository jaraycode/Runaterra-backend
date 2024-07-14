import { BadRequestException } from "@nestjs/common";
import { CreateLinkDto } from "@src/core/contributions/dto/link.dto";
import { CreateFileDto } from "@src/core/files/dto/create-file.dto";

// utils.ts
export function parseStringToJson(item: string): any {
  if (!item.startsWith("{")) item = "{" + item;
  if (!item.endsWith("}")) item = item + "}";
  return JSON.parse(item);
}

export function convertStringToArrayOfJson(str: string, separator: string = "},{"): any[] {
  return str.split(separator).map(parseStringToJson);
}

export function handleContributionDtoField(field: any): any {
  if (!field) return [];

  if (typeof field === "string") {
    return convertStringToArrayOfJson(field);
  } else if (Array.isArray(field)) {
    return field.map((item) => (typeof item === "string" ? JSON.parse(item) : item));
  } else if (typeof field === "object") {
    // obtiene todas las propiedades del objeto
    const keys = Object.keys(field);
    return keys.map((key) => field[key]);
  }

  return field;
}

function formatFilesJson(files: any): CreateFileDto[] {
  return files.map((item) => {
    if (typeof item === "string") {
      const _file = parseJsonKeysToLowerCase(item);
      // manualy validate file
      if (!_file.name || !_file.description) {
        throw new BadRequestException("Formato de archivo invalido en validacion manual");
      }

      return _file;
    }
    return item;
  });
}

export function handleContributionDtoFileField(_file: any): CreateFileDto[] {
  const file = handleContributionDtoField(_file);
  return formatFilesJson(file);
}

function parseJsonKeysToLowerCase(item: string): any {
  const itemJson = JSON.parse(item);
  const keys = Object.keys(itemJson);
  const _object = {};
  keys.map((key) => {
    _object[key.toLowerCase()] = itemJson[key];
  });
  return _object;
}

function formatLinksJson(links: any): CreateLinkDto[] {
  return links.map((item) => {
    if (typeof item === "string") {
      const _link = parseJsonKeysToLowerCase(item);

      // manually validate link is link type
      if (!_link.url || !_link.description) {
        throw new BadRequestException("Formato de link invalido en validacion manual");
      }

      return _link;
    }
    return item;
  });
}

export function handleContributionDtoLinkField(_link: any): CreateLinkDto[] {
  const link = handleContributionDtoField(_link);
  return formatLinksJson(link);
}
