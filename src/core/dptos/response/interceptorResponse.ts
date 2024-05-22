import { withBaseResponse, withBaseResponseSingle } from "@src/common/function/withBaseResponse";
import { Dpto } from "@src/core/dptos/entities/dpto.entity";

export class ResponseDptosDto extends withBaseResponse(Dpto) {}

export class ResponseUpdateDptos extends withBaseResponseSingle(Dpto) {}

export class ResponseDeleteDptos {
  message: string;
}
