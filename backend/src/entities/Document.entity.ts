import { Entity, Column, ManyToOne, JoinColumn, Index } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { DocumentType, DocumentStatus } from "../constants/CreditStatus";
import { User } from "./User.entity";
import { Company } from "./Company.entity";
import { CreditApplication } from "./CreditApplication.entity";

@Entity("documents")
export class Document extends BaseEntity {
    @Index()
    @Column({
        type: "enum",
        enum: DocumentType,
    })
    type!: DocumentType;

    @Column({ type: "varchar", length: 255 })
    fileName!: string;

    @Column({ type: "varchar", length: 2048 })
    fileUrl!: string; // Supabase Storage URL

    @Column({ type: "varchar", length: 500, nullable: true })
    storagePath?: string; // Path in Supabase Storage

    @Column({ type: "varchar", length: 100, nullable: true })
    mimeType?: string;

    @Column({ type: "bigint", nullable: true })
    fileSize?: number; // in bytes

    @Index()
    @Column({
        type: "enum",
        enum: DocumentStatus,
        default: DocumentStatus.PENDING,
    })
    status!: DocumentStatus;

    @Column({ type: "text", nullable: true })
    rejectionReason?: string;

    @Column({ type: "timestamp", nullable: true })
    reviewedAt?: Date;

    @Column({ type: "varchar", length: 255, nullable: true })
    digitalSignature!: string;

    @Column({ type: "timestamp", nullable: true })
    signedAt?: Date;

    @Index()
    @Column({ type: "varchar", length: 255, nullable: true })
    contentHash!: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    signatureHash?: string;

    @Column({ type: "varchar", length: 50, nullable: true })
    signatureAlgorithm?: string;

    @Column({ type: "varchar", length: 64, nullable: true })
    certificateThumbprint?: string;

    // Relations
    @ManyToOne(() => CreditApplication, (application) => application.documents, { onDelete: "CASCADE" })
    @JoinColumn({ name: "credit_application_id" })
    creditApplication?: CreditApplication;

    @Index()
    @Column({ name: "credit_application_id", nullable: true })
    creditApplicationId?: string;

    @ManyToOne(() => Company, (company) => company.documents, { onDelete: "CASCADE" })
    @JoinColumn({ name: "company_id" })
    company!: Company;

    @Index()
    @Column({ name: "company_id" })
    companyId!: string;

    @Index()
    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: "uploaded_by" })
    uploadedBy?: User;

    @Column({ name: "uploaded_by", nullable: true })
    uploadedById?: string;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: "reviewed_by" })
    reviewedBy?: User;

    @Index()
    @Column({ name: "reviewed_by", nullable: true })
    reviewedById?: string;
}