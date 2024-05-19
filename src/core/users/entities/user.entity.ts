import { ApiProperty } from "@nestjs/swagger";
import { UserRole } from "@src/constants";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn("increment")
  id: number;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column({ unique: true, nullable: false })
  email: string;

  @ApiProperty()
  @Column({ nullable: false, select: false })
  password: string;

  @ApiProperty()
  @Column({ type: "date" })
  birthdate: string;

  @ApiProperty({ enum: UserRole })
  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.DPTO,
  })
  role: UserRole;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt: Date;

  @DeleteDateColumn({ type: "timestamptz" })
  deletedAt: Date;
}
