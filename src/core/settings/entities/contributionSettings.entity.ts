import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
@Entity()
export class ContributionSettings {
  @ApiProperty()
  @PrimaryGeneratedColumn("increment")
  id: number;

  @ApiProperty()
  @Column({ type: "timestamptz" })
  initDate: Date;

  @ApiProperty()
  @Column({ type: "timestamptz" })
  endDate: Date;

  @ApiProperty()
  @Column({ type: "boolean" })
  getNotificationForContribution: boolean;

  @ApiProperty()
  @Column({ type: "boolean" })
  recordatory: boolean;
}
