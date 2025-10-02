import { Entity, Column, ManyToOne, OneToMany, JoinColumn, Index } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { Document } from "./Document.entity";
import { CreditApplicationStatus, KYCStatus } from "../constants/CreditStatus";
import { User } from "./User.entity";
import { Company } from "./Company.entity";

@Entity("credit_applications")
export class CreditApplication extends BaseEntity {
    @Column({ type: "varchar", length: 50, unique: true })
    @Index()
    applicationNumber!: string;

    @Column({ type: "decimal", precision: 15, scale: 2 })
    requestedAmount!: number;

    @Column({ type: "varchar", length: 100 })
    purpose!: string;

    @Column({ type: "text", nullable: true })
    purposeDescription?: string;

    @Column({ type: "int", default: 12 })
    termMonths!: number; // Loan term in months

    @Column({
        type: "enum",
        enum: CreditApplicationStatus,
        default: CreditApplicationStatus.DRAFT,
    })
    @Index()
    status!: CreditApplicationStatus;

    @Column({
        type: "enum",
        enum: KYCStatus,
        default: KYCStatus.NOT_STARTED,
    })
    kycStatus!: KYCStatus;

    @Column({ type: "int", default: 0, comment: "0-100" })
    completionPercentage!: number;

    @Column({ type: "decimal", precision: 5, scale: 2, nullable: true })
    approvedAmount?: number;

    @Column({ type: "decimal", precision: 5, scale: 2, nullable: true })
    interestRate?: number;

    @Column({ type: "text", nullable: true })
    rejectionReason?: string;

    @Column({ type: "text", nullable: true })
    internalNotes?: string;

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

    // Relations
    @ManyToOne(() => Company, (company) => company.creditApplications, { onDelete: "CASCADE" })
    @JoinColumn({ name: "company_id" })
    company!: Company;

    @Column({ name: "company_id" })
    companyId!: string;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: "reviewed_by" })
    reviewedBy?: User;

    @Column({ name: "reviewed_by", nullable: true })
    reviewedById?: string;

    @OneToMany(() => Document, (document) => document.creditApplication)
    documents?: Document[];
}