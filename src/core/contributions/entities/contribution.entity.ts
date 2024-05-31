import { ApiProperty } from "@nestjs/swagger";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Link } from "./link.entity";

@Entity()
export class Contribution {
  @ApiProperty()
  @PrimaryGeneratedColumn("increment")
  id: number;

  @ApiProperty()
  @Column("jsonb", { nullable: true, default: {} })
  link: Link[];

  @ApiProperty()
  @Column({ nullable: true })
  description: string;

  // TODO: relation with user
  // TODO: relation with categories

  @ApiProperty()
  @CreateDateColumn({ type: "timestamptz" })
  createAt: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updateAt: Date;

  @DeleteDateColumn({ type: "timestamptz" })
  deleteAt: Date;
}
