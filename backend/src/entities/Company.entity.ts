import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
  RelationId,
} from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { User } from "./User.entity";
import { CreditApplication } from "./CreditApplication.entity";
import { Document } from "./Document.entity";

@Entity("companies")
export class Company extends BaseEntity {
  @Column({ type: "varchar", length: 255 })
  legalName!: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  tradeName?: string;

  @Column({ type: "varchar", length: 50, unique: true })
  taxId!: string; // RFC, CUIT, etc.

  @Column({ type: "varchar", length: 255, nullable: true, unique: true })
  email?: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  industry?: string;

  @Column({ type: "date", nullable: true })
  foundedDate?: Date;

  @Column({ type: "int", nullable: true })
  employeeCount?: number;

  @Column({ type: "decimal", precision: 15, scale: 2, nullable: true })
  annualRevenue?: number;

  @Column({ type: "text", nullable: true })
  address?: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  city?: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  state?: string;

  @Column({ type: "varchar", length: 20, nullable: true })
  postalCode?: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  country?: string;

  @Column({ type: "varchar", length: 20, nullable: true })
  phone?: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  website?: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  // Relations
  @Index("ix_companies_owner_id") 
  @ManyToOne(() => User, (u) => u.companies, {
    onDelete: "CASCADE",
    nullable: false,
  })
  @JoinColumn({ name: "owner_id" })
  owner!: User;

 
  @RelationId((c: Company) => c.owner)
  ownerId!: string;

  @OneToMany(() => CreditApplication, (application) => application.company)
  creditApplications?: CreditApplication[];

  @OneToMany(() => Document, (document) => document.company)
  documents?: Document[];
}
