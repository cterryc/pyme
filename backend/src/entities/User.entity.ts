import { Entity, Column, OneToMany, Index } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { UserRole } from "../constants/Roles";
import { Company } from "./Company.entity";

@Entity("users")
export class User extends BaseEntity {
    @Column({ type: "varchar", length: 255 })
    @Index()
    email!: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    password?: string;

    @Column({ type: "varchar", length: 100 })
    firstName!: string;

    @Column({ type: "varchar", length: 100 })
    lastName!: string;

    @Column({ type: "varchar", length: 20, nullable: true })
    phone?: string;

    @Column({
        type: "enum",
        enum: UserRole,
        default: UserRole.COMPANY,
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
}
