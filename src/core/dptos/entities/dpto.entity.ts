import { ApiProperty } from "@nestjs/swagger";
import { Category } from "@src/core/categories/entities/category.entity";
import { User } from "@src/core/users/entities/user.entity";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Dpto {
  @ApiProperty()
  @PrimaryGeneratedColumn("increment")
  id: number;

  @ApiProperty()
  @Column({ nullable: false })
  name: string;

  @OneToMany(() => User, (user) => user.department)
  user: User[];

  @ManyToMany(() => Category, (categories) => categories.dptos, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
    cascade: true,
    eager: true,
  })
  @JoinTable({
    name: "dpto_category",
    joinColumn: {
      name: "dptoId",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "categoryId",
      referencedColumnName: "id",
    },
  })
  categories: Category[];

  @CreateDateColumn({ type: "timestamptz" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt: Date;

  @DeleteDateColumn({ type: "timestamptz" })
  deleteAt: Date;
}
