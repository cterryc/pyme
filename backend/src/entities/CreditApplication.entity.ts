import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
  OneToOne,
} from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { Document } from "./Document.entity";
import { CreditApplicationStatus} from "../constants/CreditStatus";
import { User } from "./User.entity";
import { Company } from "./Company.entity";
import { RiskTier } from "../constants/RiskTier";
import { Signature } from "./Signature.entity";

@Entity("credit_applications")
export class CreditApplication extends BaseEntity {
  @Column({ type: "varchar", length: 50, unique: true })
  applicationNumber!: string;

  // --- DATOS INICIALES DE LA OFERTA (Calculados por el sistema) ---
  @Column({
    type: "jsonb",
    nullable: true,
    comment: "Almacena la oferta inicial del sistema",
  })
  offerDetails?: {
    minAmount: number;
    maxAmount: number;
    interestRate: number;
    allowedTerms: number[]; // e.g., [12, 24, 36]
    //metadata de cálculo
    calculationSnapshot: {
      baseRate: number;
      companyRiskTier: RiskTier;
      industryRiskTier: RiskTier;
      riskTierConfig: {
        tier: RiskTier;
        spread: number;
        factor: number;
      };
      systemConfigs: Record<string, number>; // Configs usadas
      calculatedAt: Date;
    };
  };

  // validación de transiciones
  @Column({ type: "jsonb", nullable: true })
  statusHistory?: {
    status: CreditApplicationStatus;
    timestamp: Date;
    changedBy?: string; // userId
    reason?: string;
  }[];

  @Column({
    type: "decimal",
    precision: 15,
    scale: 2,
    nullable: true,
    comment: "Monto final seleccionado por el owner",
  })
  selectedAmount?: number;

  @Column({
    type: "int",
    nullable: true,
    comment: "Plazo en meses seleccionado por el owner",
  })
  selectedTermMonths?: number;

  @Index()
  @Column({
    type: "enum",
    enum: CreditApplicationStatus,
    default: CreditApplicationStatus.DRAFT,
  })
  status!: CreditApplicationStatus;

  // --- DATOS DE LA REVISIÓN DEL ADMINISTRADOR ---
  @Column({
    type: "decimal",
    precision: 15,
    scale: 2,
    nullable: true,
    comment: "Monto final aprobado por el admin",
  })
  approvedAmount?: number;

  @Column({ type: "text", nullable: true })
  rejectionReason?: string;

  @Column({ type: "text", nullable: true })
  internalNotes?: string;

  @Column({ type: "text", nullable: true, comment: "Notas visibles para el usuario" })
  userNotes?: string;

  @Column({ type: "int", nullable: true, comment: "Risk score 0-100" })
  riskScore?: number;

  @Column({ type: "timestamp", nullable: true })
  submittedAt?: Date;

  @Column({ type: "timestamp", nullable: true })
  reviewedAt?: Date;

  @Column({ type: "timestamp", nullable: true })
  approvedAt?: Date;

  @Column({ type: "timestamp", nullable: true })
  disbursedAt?: Date;

  @Column({ type: "jsonb", nullable: true })
  formData?: Record<string, any>; // Store dynamic form data

  @Column({ name: "contract_document", nullable: true })
  contractDocument?: string;

  // Relations
  @ManyToOne(() => Company, (company) => company.creditApplications, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "company_id" })
  company!: Company;

  @Index()
  @Column({ name: "company_id" })
  companyId!: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: "reviewed_by" })
  reviewedBy?: User;

  @Index()
  @Column({ name: "reviewed_by", nullable: true })
  reviewedById?: string;

  @OneToMany(() => Document, (document) => document.creditApplication)
  documents?: Document[];

  @Column({ name: "request_id", nullable: true })
  requestId?: string;

  // Nueva relación con Signature
  @OneToOne(() => Signature, (signature) => signature.creditApplication, {
    cascade: true,
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "signature_id" })
  signature?: Signature;

  @Column({ name: "signature_id", nullable: true })
  signatureId?: string;
}
