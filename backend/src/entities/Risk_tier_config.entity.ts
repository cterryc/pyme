import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { RiskTier } from "../constants/RiskTier"; 

@Entity("risk_tier_configs")
export class RiskTierConfig extends BaseEntity {
  @Index({ unique: true })
  @Column({
    type: "enum",
    enum: RiskTier,
    nullable: false,
  })
  tier!: RiskTier; // A, B, C, D

  @Column({ type: "decimal", precision: 5, scale: 2, nullable: false })
  spread!: number; // e.g., 8.00

  @Column({ type: "decimal", precision: 5, scale: 4, nullable: false })
  factor!: number; // e.g., 0.3500

  @Column({ type: "jsonb", nullable: false })
  allowed_terms!: number[]; // e.g., [12, 18, 24, 36] as JSON array
}