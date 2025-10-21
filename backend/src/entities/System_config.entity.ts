import {
  Entity,
  Column,
  Index,
} from "typeorm";
import { BaseEntity } from "./BaseEntity";

@Entity("system_configs")
export class SystemConfig extends BaseEntity {
  @Index({ unique: true })
  @Column({ type: "varchar", length: 100, nullable: false })
  key!: string; // e.g., 'BASE_RATE'

  @Column({ type: "decimal", precision: 100, scale: 7, nullable: false })
  value!: number; // e.g., 20.0000

  @Column({ type: "text", nullable: true })
  description?: string; // Optional notes
}