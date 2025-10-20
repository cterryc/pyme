import { Entity, Column, OneToMany, Index } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { UserRole } from "../constants/Roles";
import { Company } from "./Company.entity";

@Entity("users")
export class User extends BaseEntity {
  @Column({ unique: true, type: "varchar", length: 255 })
  email!: string;

  @Column({ type: "varchar", length: 255, select: true })
  password!: string;

  @Column({ type: "varchar", length: 100, nullable: true })
    firstName!: string;

  @Column({ type: "varchar", length: 100, nullable: true })
    lastName!: string;

  @Column({ type: "varchar", length: 20, nullable: true })
  phone?: string;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.OWNER,
  })
  role!: UserRole;

  @Column({ type: "boolean", default: false })
  isEmailVerified!: boolean;

  @Column({ type: "boolean", default: true })
  isActive!: boolean;

  @Column({ type: "varchar", length: 255, nullable: true })
  googleId?: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  profileImage?: string;

  @Column({ type: "timestamp", nullable: true })
  lastLogin?: Date;

  // Relations
  @OneToMany(() => Company, (company) => company.owner)
  companies?: Company[];

  @Column({ type: "varchar", length: 6, nullable: true })
  emailVerificationToken?: string;
}
