import { ApiProperty } from "@nestjs/swagger";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Link } from "./link.entity";
import { User } from "@src/core/users/entities/user.entity";
import { Files } from "@src/core/files/entities/file.entity";
@Entity()
export class Contribution {
  @ApiProperty()
  @PrimaryGeneratedColumn("increment")
  id: number;

  @ApiProperty()
  @Column({ nullable: false, unique: true })
  uuid: string;

  @ApiProperty()
  @Column("jsonb", { nullable: true })
  link?: Link[];

  @ApiProperty()
  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => User, (user) => user.contributions)
  user: User;

  @OneToMany(() => Files, (file) => file.contribution)
  files?: Files[];

  @ApiProperty()
  @CreateDateColumn({ type: "timestamptz" })
  createAt: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updateAt: Date;

  @DeleteDateColumn({ type: "timestamptz" })
  deleteAt: Date;
}
