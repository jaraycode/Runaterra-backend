import { ApiProperty } from "@nestjs/swagger";
import { Category } from "@src/core/categories/entities/category.entity";
import { Criteria } from "@src/core/criteria/entities/criteria.entity";
import { Contribution } from "@src/core/contributions/entities/contribution.entity";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Indicator {
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
  @Column()
  description: string;

  @OneToMany(() => Category, (category) => category.indicator)
  categories: Category[];

  @OneToMany(() => Criteria, (criteria) => criteria.indicator)
  criteria: Criteria[];

  @CreateDateColumn({ type: "timestamptz" })
  createAt: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updateAt: Date;

  @DeleteDateColumn({ type: "timestamptz" })
  deleteAt: Date;

  @OneToMany(() => Contribution, (contribution) => contribution.indicator)
  contribution: Contribution[];
}
