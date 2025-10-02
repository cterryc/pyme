import {
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    Index,
} from "typeorm";

export abstract class BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Index()
    @CreateDateColumn({ name: "created_at" })
    createdAt!: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt!: Date;

    @DeleteDateColumn({ name: "deleted_at", nullable: true })
    deletedAt?: Date;
}
