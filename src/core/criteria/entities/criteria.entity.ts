import { ApiProperty } from "@nestjs/swagger";
import { Indicator } from "@src/core/indicators/entities/indicator.entity";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Criteria {
  @ApiProperty()
  @PrimaryGeneratedColumn("increment")
  id: number;

  @ApiProperty()
  @Column({ nullable: false })
  name: string;

  @ApiProperty()
  @Column({ nullable: false })
  index: number;

  @ApiProperty()
  @Column({ nullable: true })
  description: string;

  @ApiProperty({
    type: Indicator,
  })
  @ManyToOne(() => Indicator, (indicator) => indicator.criteria)
  indicator: Indicator;

  @CreateDateColumn({ type: "timestamptz" })
  createAt: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updateAt: Date;

  @DeleteDateColumn({ type: "timestamptz" })
  deleteAt: Date;
}
