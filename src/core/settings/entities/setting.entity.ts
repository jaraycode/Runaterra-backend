import { ApiProperty } from "@nestjs/swagger";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { ContributionSettings } from "./contributionSettings.entity";

@Entity()
export class Setting {
  @ApiProperty()
  @PrimaryColumn()
  key: string;

  @ApiProperty()
  @Column({ type: "jsonb" })
  contributionSettings: ContributionSettings;

  @CreateDateColumn({ type: "timestamptz" })
  createAt: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updateAt: Date;

  @DeleteDateColumn({ type: "timestamptz" })
  deleteAt: Date;
}
