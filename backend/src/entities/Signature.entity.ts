import { Entity, Column, OneToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { CreditApplication } from "./CreditApplication.entity";

@Entity("signatures")
export class Signature extends BaseEntity {
  @Column({ type: "varchar", length: 255, nullable: false })
  docHash!: string;

  @Column({ type: "varchar", length: 255, nullable: false })
  docId!: string;

  @Column({ type: "varchar", length: 500, nullable: true })
  docUrl?: string;

  @Column({ type: "varchar", length: 500, nullable: true })
  callback?: string;

  @Column({ type: "varchar", length: 500, nullable: true })
  returnUrl?: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  externalRef?: string;

  // Relación con CreditApplication
  @OneToOne(() => CreditApplication, (creditApplication) => creditApplication.signature, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "credit_application_id" })
  creditApplication?: CreditApplication;

  @Column({ name: "credit_application_id", nullable: true })
  creditApplicationId?: string;
}