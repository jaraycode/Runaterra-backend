import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
  ValidationOptions,
} from "class-validator";
import { DataSource } from "typeorm";

@ValidatorConstraint({ async: true })
export class isUnique implements ValidatorConstraintInterface {
  constructor(private readonly dataSource: DataSource) {}

  async validate(value: any, args: ValidationArguments) {
    const [entityName, exceptField = null] = args.constraints;
    const [property] = args.property.split(".");
    const entity = this.dataSource.manager.getRepository(entityName);
    console.log("args", args);
    const result = await entity.findOne({ where: { [property]: value } });

    if (!result) return true;
    // except field
    if (!exceptField) return false;

    const exceptFieldValue = (args.object as any)[exceptField];
    if (!exceptFieldValue) return false;

    return result[exceptField] === exceptFieldValue;
  }

  defaultMessage(args: ValidationArguments) {
    const [entityName] = args.constraints;
    return `${args.property} alread exists in ${entityName}!`;
  }
}

export function Unique(entityName: string, exceptField: string = null, validationOptions?: ValidationOptions) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [entityName, exceptField],
      validator: isUnique,
    });
  };
}
