import { withBaseResponse, withBaseResponseSingle } from "@src/common/function/withBaseResponse";
import { Category } from "../entities/category.entity";

export class ResponseCategoryDto extends withBaseResponse(Category) {}

export class ResponseUpdateCategory extends withBaseResponseSingle(Category) {}

export class ResponseDeleteCriteria {
  message: string;
}
