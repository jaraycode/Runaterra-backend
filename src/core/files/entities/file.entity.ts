import { Contribution } from "@src/core/contributions/entities/contribution.entity";
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
export class Files {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  path: string;

  @Column()
  type: string;

  @Column()
  size: number;

  @ManyToOne(() => Contribution, (contribution) => contribution.files)
  contribution: Contribution;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt: Date;

  @DeleteDateColumn({ type: "timestamptz" })
  deletedAt: Date;
}
