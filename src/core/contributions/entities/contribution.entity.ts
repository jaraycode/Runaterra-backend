import { ApiProperty } from "@nestjs/swagger";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  UpdateDateColumn,
} from "typeorm";
import { Link } from "./link.entity";
import { User } from "@src/core/users/entities/user.entity";

@Entity()
export class Contribution {
  @ApiProperty()
  @PrimaryGeneratedColumn("increment")
  id: number;

  @ApiProperty()
  @Column("jsonb", { nullable: true })
  link?: Link[];

  @ApiProperty()
  @Column({ nullable: true })
  description: string;

  // TODO: relation with user
  @ManyToOne(() => User, (user) => user.contributions)
  user: User;

  // TODO: relation with categories

  @ApiProperty()
  @CreateDateColumn({ type: "timestamptz" })
  createAt: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updateAt: Date;

  @DeleteDateColumn({ type: "timestamptz" })
  deleteAt: Date;
}
