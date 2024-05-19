import { ApiProperty } from "@nestjs/swagger";

export class ResponseDelete {
  @ApiProperty()
  message: string;
}
