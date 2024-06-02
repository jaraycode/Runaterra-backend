import { ApiProperty } from "@nestjs/swagger";
import { Category } from "@src/core/categories/entities/category.entity";
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

  @ManyToOne(() => Indicator, (indicator) => indicator.criteria)
  indicator: Indicator;

  @ManyToOne(() => Category, (category) => category.criteria)
  categories: Category;

  @CreateDateColumn({ type: "timestamptz" })
  createAt: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updateAt: Date;

  @DeleteDateColumn({ type: "timestamptz" })
  deleteAt: Date;
}
