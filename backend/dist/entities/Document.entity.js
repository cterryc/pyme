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
exports.Document = void 0;
const typeorm_1 = require("typeorm");
const BaseEntity_1 = require("./BaseEntity");
const CreditStatus_1 = require("../constants/CreditStatus");
const User_entity_1 = require("./User.entity");
const Company_entity_1 = require("./Company.entity");
const CreditApplication_entity_1 = require("./CreditApplication.entity");
let Document = class Document extends BaseEntity_1.BaseEntity {
};
exports.Document = Document;
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({
        type: "enum",
        enum: CreditStatus_1.DocumentType,
    }),
    __metadata("design:type", String)
], Document.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255 }),
    __metadata("design:type", String)
], Document.prototype, "fileName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 2048 }),
    __metadata("design:type", String)
], Document.prototype, "fileUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 500, nullable: true }),
    __metadata("design:type", String)
], Document.prototype, "storagePath", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 100, nullable: true }),
    __metadata("design:type", String)
], Document.prototype, "mimeType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "bigint", nullable: true }),
    __metadata("design:type", Number)
], Document.prototype, "fileSize", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({
        type: "enum",
        enum: CreditStatus_1.DocumentStatus,
        default: CreditStatus_1.DocumentStatus.PENDING,
    }),
    __metadata("design:type", String)
], Document.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], Document.prototype, "rejectionReason", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", nullable: true }),
    __metadata("design:type", Date)
], Document.prototype, "reviewedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: true }),
    __metadata("design:type", String)
], Document.prototype, "digitalSignature", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", nullable: true }),
    __metadata("design:type", Date)
], Document.prototype, "signedAt", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: true }),
    __metadata("design:type", String)
], Document.prototype, "contentHash", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: true }),
    __metadata("design:type", String)
], Document.prototype, "signatureHash", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 50, nullable: true }),
    __metadata("design:type", String)
], Document.prototype, "signatureAlgorithm", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 64, nullable: true }),
    __metadata("design:type", String)
], Document.prototype, "certificateThumbprint", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => CreditApplication_entity_1.CreditApplication, (application) => application.documents, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "credit_application_id" }),
    __metadata("design:type", CreditApplication_entity_1.CreditApplication)
], Document.prototype, "creditApplication", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ name: "credit_application_id", nullable: true }),
    __metadata("design:type", String)
], Document.prototype, "creditApplicationId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Company_entity_1.Company, (company) => company.documents, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "company_id" }),
    __metadata("design:type", Company_entity_1.Company)
], Document.prototype, "company", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ name: "company_id" }),
    __metadata("design:type", String)
], Document.prototype, "companyId", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.ManyToOne)(() => User_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: "uploaded_by" }),
    __metadata("design:type", User_entity_1.User)
], Document.prototype, "uploadedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "uploaded_by", nullable: true }),
    __metadata("design:type", String)
], Document.prototype, "uploadedById", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: "reviewed_by" }),
    __metadata("design:type", User_entity_1.User)
], Document.prototype, "reviewedBy", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ name: "reviewed_by", nullable: true }),
    __metadata("design:type", String)
], Document.prototype, "reviewedById", void 0);
exports.Document = Document = __decorate([
    (0, typeorm_1.Entity)("documents")
], Document);
