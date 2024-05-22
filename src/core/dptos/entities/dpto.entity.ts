import { ApiProperty } from "@nestjs/swagger";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Dpto {
  @ApiProperty()
  @PrimaryGeneratedColumn("increment")
  id: number;

  @ApiProperty()
  @Column({ nullable: false })
  name: string;

  @CreateDateColumn({ type: "timestamptz" })
  createDate: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updateDate: Date;

  @DeleteDateColumn({ type: "timestamptz" })
  deleteAt: Date;
}
