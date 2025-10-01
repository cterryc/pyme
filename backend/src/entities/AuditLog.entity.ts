import { Entity, Column, ManyToOne, JoinColumn, Index } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { User } from "./User.entity";

@Entity("audit_logs")
export class AuditLog extends BaseEntity {
    @Column({ type: "varchar", length: 100 })
    @Index()
    action!: string; // e.g., "CREATE", "UPDATE", "DELETE", "STATUS_CHANGE"

    @Column({ type: "varchar", length: 100 })
    @Index()
    entityType!: string; // e.g., "CreditApplication", "Document"

    @Column({ type: "uuid" })
    @Index()
    entityId!: string;

    @Column({ type: "jsonb", nullable: true })
    oldValues?: Record<string, any>;

    @Column({ type: "jsonb", nullable: true })
    newValues?: Record<string, any>;

    @Column({ type: "varchar", length: 50, nullable: true })
    ipAddress?: string;

    @Column({ type: "text", nullable: true })
    userAgent?: string;

    @Column({ type: "text", nullable: true })
    description?: string;

    // Relations
    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: "user_id" })
    user?: User;

    @Column({ name: "user_id", nullable: true })
    userId?: string;
}
