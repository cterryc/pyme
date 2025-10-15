import {
  Entity,
  Column,
  OneToMany,
} from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { Company } from "./Company.entity";
import { RiskTier } from "../constants/RiskTier"; 

@Entity("industries")
export class Industry extends BaseEntity {
  @Column({ type: "varchar", length: 100, unique: true })
  name!: string; // e.g., 'software' in lowercase

  @Column({
    type: "enum",
    enum: RiskTier,
    nullable: false,
  })
  baseRiskTier!: RiskTier;

  @Column({ type: "text", nullable: true })
  description?: string;

  // Relation: One industry to many companies
  @OneToMany(() => Company, (company) => company.industry)
  companies?: Company[];
}