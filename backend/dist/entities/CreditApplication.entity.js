"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreditApplication = void 0;
const typeorm_1 = require("typeorm");
const BaseEntity_1 = require("./BaseEntity");
const Document_entity_1 = require("./Document.entity");
const CreditStatus_1 = require("../constants/CreditStatus");
const User_entity_1 = require("./User.entity");
const Company_entity_1 = require("./Company.entity");
const Signature_entity_1 = require("./Signature.entity");
let CreditApplication = class CreditApplication extends BaseEntity_1.BaseEntity {
};
exports.CreditApplication = CreditApplication;
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 50, unique: true }),
    __metadata("design:type", String)
], CreditApplication.prototype, "applicationNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "jsonb",
        nullable: true,
        comment: "Almacena la oferta inicial del sistema",
    }),
    __metadata("design:type", Object)
], CreditApplication.prototype, "offerDetails", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "jsonb", nullable: true }),
    __metadata("design:type", Array)
], CreditApplication.prototype, "statusHistory", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "decimal",
        precision: 15,
        scale: 2,
        nullable: true,
        comment: "Monto final seleccionado por el owner",
    }),
    __metadata("design:type", Number)
], CreditApplication.prototype, "selectedAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "int",
        nullable: true,
        comment: "Plazo en meses seleccionado por el owner",
    }),
    __metadata("design:type", Number)
], CreditApplication.prototype, "selectedTermMonths", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({
        type: "enum",
        enum: CreditStatus_1.CreditApplicationStatus,
        default: CreditStatus_1.CreditApplicationStatus.DRAFT,
    }),
    __metadata("design:type", String)
], CreditApplication.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "decimal",
        precision: 15,
        scale: 2,
        nullable: true,
        comment: "Monto final aprobado por el admin",
    }),
    __metadata("design:type", Number)
], CreditApplication.prototype, "approvedAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], CreditApplication.prototype, "rejectionReason", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], CreditApplication.prototype, "internalNotes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true, comment: "Notas visibles para el usuario" }),
    __metadata("design:type", String)
], CreditApplication.prototype, "userNotes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", nullable: true, comment: "Risk score 0-100" }),
    __metadata("design:type", Number)
], CreditApplication.prototype, "riskScore", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", nullable: true }),
    __metadata("design:type", Date)
], CreditApplication.prototype, "submittedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", nullable: true }),
    __metadata("design:type", Date)
], CreditApplication.prototype, "reviewedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", nullable: true }),
    __metadata("design:type", Date)
], CreditApplication.prototype, "approvedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", nullable: true }),
    __metadata("design:type", Date)
], CreditApplication.prototype, "disbursedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "jsonb", nullable: true }),
    __metadata("design:type", Object)
], CreditApplication.prototype, "formData", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Company_entity_1.Company, (company) => company.creditApplications, {
        onDelete: "CASCADE",
    }),
    (0, typeorm_1.JoinColumn)({ name: "company_id" }),
    __metadata("design:type", Company_entity_1.Company)
], CreditApplication.prototype, "company", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ name: "company_id" }),
    __metadata("design:type", String)
], CreditApplication.prototype, "companyId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: "reviewed_by" }),
    __metadata("design:type", User_entity_1.User)
], CreditApplication.prototype, "reviewedBy", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ name: "reviewed_by", nullable: true }),
    __metadata("design:type", String)
], CreditApplication.prototype, "reviewedById", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Document_entity_1.Document, (document) => document.creditApplication),
    __metadata("design:type", Array)
], CreditApplication.prototype, "documents", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "request_id", nullable: true }),
    __metadata("design:type", String)
], CreditApplication.prototype, "requestId", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Signature_entity_1.Signature, (signature) => signature.creditApplication, {
        cascade: true,
        onDelete: "SET NULL",
    }),
    (0, typeorm_1.JoinColumn)({ name: "signature_id" }),
    __metadata("design:type", Signature_entity_1.Signature)
], CreditApplication.prototype, "signature", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "signature_id", nullable: true }),
    __metadata("design:type", String)
], CreditApplication.prototype, "signatureId", void 0);
exports.CreditApplication = CreditApplication = __decorate([
    (0, typeorm_1.Entity)("credit_applications")
], CreditApplication);
//# sourceMappingURL=CreditApplication.entity.js.map