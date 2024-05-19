import { withBaseResponse, withBaseResponseSingle } from "@src/common/function/withBaseResponse";
import { User } from "@src/core/users/entities/user.entity";

export class ResponseUserDto extends withBaseResponse(User) {}

export class ResponseUpdateUser extends withBaseResponseSingle(User) {}

export class ResponseDeleteUser {
  message: string;
}
