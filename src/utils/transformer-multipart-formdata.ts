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
  if (typeof field === "string") {
    return convertStringToArrayOfJson(field);
  } else if (Array.isArray(field)) {
    return field.map((item) => (typeof item === "string" ? JSON.parse(item) : item));
  }
  return field;
}
