import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class Link {
  @ApiProperty()
  @PrimaryGeneratedColumn("increment")
  id: number;

  @ApiProperty()
  @IsString()
  URL: string;

  @ApiProperty()
  @IsString()
  description: string;
}
