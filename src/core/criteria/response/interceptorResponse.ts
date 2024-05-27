import { withBaseResponse, withBaseResponseSingle } from "@src/common/function/withBaseResponse";
import { Criteria } from "../entities/criteria.entity";

export class ResponseCriteriaDto extends withBaseResponse(Criteria) {}

export class ResponseUpdateCriteria extends withBaseResponseSingle(Criteria) {}

export class ResponseDeleteCriteria {
  message: string;
}
