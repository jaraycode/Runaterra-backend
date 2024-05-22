import { withBaseResponse, withBaseResponseSingle } from "@src/common/function/withBaseResponse";
import { Indicator } from "../entities/indicator.entity";

export class ResponseIndicatorDto extends withBaseResponse(Indicator) {}

export class ResponseUpdateIndicators extends withBaseResponseSingle(Indicator) {}

export class ResponseDeleteIndicator {
  message: string;
}
