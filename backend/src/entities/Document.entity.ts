import { Entity, Column, ManyToOne, JoinColumn, Index } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { CreditApplication } from "./CreditApplication.entity";
import { DocumentType, DocumentStatus } from "../constants/CreditStatus";
import { User } from "./User.entity";

@Entity("documents")
export class Document extends BaseEntity {
    @Column({
        type: "enum",
        enum: DocumentType,
    })
    @Index()
    type!: DocumentType;

    @Column({ type: "varchar", length: 255 })
    fileName!: string;

    @Column({ type: "varchar", length: 500 })
    fileUrl!: string; // Supabase Storage URL

    @Column({ type: "varchar", length: 500, nullable: true })
    storagePath?: string; // Path in Supabase Storage

    @Column({ type: "varchar", length: 100, nullable: true })
    mimeType?: string;

    @Column({ type: "bigint", nullable: true })
    fileSize?: number; // in bytes

    @Column({
        type: "enum",
        enum: DocumentStatus,
        default: DocumentStatus.PENDING,
    })
    @Index()
    status!: DocumentStatus;

    @Column({ type: "text", nullable: true })
    rejectionReason?: string;

    @Column({ type: "timestamp", nullable: true })
    uploadedAt?: Date;

    @Column({ type: "timestamp", nullable: true })
    reviewedAt?: Date;

    // Relations
    @ManyToOne(() => CreditApplication, (application) => application.documents, { onDelete: "CASCADE" })
    @JoinColumn({ name: "credit_application_id" })
    creditApplication!: CreditApplication;

    @Column({ name: "credit_application_id" })
    creditApplicationId!: string;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: "uploaded_by" })
    uploadedBy?: User;

    @Column({ name: "uploaded_by", nullable: true })
    uploadedById?: string;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: "reviewed_by" })
    reviewedBy?: User;

    @Column({ name: "reviewed_by", nullable: true })
    reviewedById?: string;
}
