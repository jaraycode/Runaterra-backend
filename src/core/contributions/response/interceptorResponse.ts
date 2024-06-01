import { withBaseResponse, withBaseResponseSingle } from "@src/common/function/withBaseResponse";
import { Contribution } from "../entities/contribution.entity";

export class ResponseContributionDto extends withBaseResponse(Contribution) {}

export class ResponseUpdateContribution extends withBaseResponseSingle(Contribution) {}

export class ResponseDeleteCriteria {
  message: string;
}
