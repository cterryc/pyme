import { Entity, Column, OneToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { CreditApplication } from "./CreditApplication.entity";

@Entity("signatures")
export class Signature extends BaseEntity {
  @Column({ type: "varchar", length: 255, nullable: false, name: 'signed_doc' })
  signedDoc!: string;

  @Column({ type: "varchar", length: 255, nullable: false, name: 'doc_hash' })
  docHash!: string;

  @Column({ type: "varchar", length: 500, nullable: true, name: 'public_key' })
  publicKey?: string;

  @Column({ type: "varchar", length: 500, nullable: true, name: 'signer_name' })
  signerName?: string;

  @Column({ type: "varchar", length: 500, nullable: true, name: 'signer_surname' })
  signerSurname?: string;

  @Column({ type: "varchar", length: 255, nullable: true, name: 'external_ref' })
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