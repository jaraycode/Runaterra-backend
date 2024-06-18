import { ApiProperty } from "@nestjs/swagger";
import { Contribution } from "@src/core/contributions/entities/contribution.entity";
import { Indicator } from "@src/core/indicators/entities/indicator.entity";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Category {
  @ApiProperty()
  @PrimaryGeneratedColumn("increment")
  id: number;

  @ApiProperty()
  @Column({ nullable: false })
  name: string;

  @ApiProperty()
  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => Indicator, (indicator) => indicator.categories)
  indicator: Indicator;

  @OneToMany(() => Contribution, (contribution) => contribution.category)
  contribution: Contribution[];

  @CreateDateColumn({ type: "timestamptz" })
  createAt: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updateAt: Date;

  @DeleteDateColumn({ type: "timestamptz" })
  deleteAt: Date;
}
