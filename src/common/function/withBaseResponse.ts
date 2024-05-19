import { mixin } from "@nestjs/common";
import { ApiProperty, ApiPropertyOptions } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";

type Constructor<T = {}> = new (...args: any[]) => T;

export function withBaseResponse<TData extends Constructor>(
  DataClass: TData,
  options?: ApiPropertyOptions | undefined,
) {
  class BaseResponse {
    @ApiProperty({
      isArray: true,
      type: () => DataClass,
      ...options,
    })
    @Type(() => DataClass)
    @ValidateNested({ each: true })
    data!: Array<InstanceType<TData>>;

    @ApiProperty()
    message?: string;
  }
  return BaseResponse;
}

export function withBaseResponseSingle<TData extends Constructor>(
  DataClass: TData,
  options?: ApiPropertyOptions | undefined,
) {
  class BaseResponse {
    @ApiProperty()
    message?: string;

    @ApiProperty({
      type: () => DataClass,
      required: false,
      ...options,
    })
    @Type(() => DataClass)
    @ValidateNested({ each: true })
    data!: InstanceType<TData>;
  }
  return BaseResponse;
}
