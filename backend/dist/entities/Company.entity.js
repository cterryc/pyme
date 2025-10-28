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
exports.Company = void 0;
const typeorm_1 = require("typeorm");
const BaseEntity_1 = require("./BaseEntity");
const User_entity_1 = require("./User.entity");
const CreditApplication_entity_1 = require("./CreditApplication.entity");
const Document_entity_1 = require("./Document.entity");
const RiskTier_1 = require("../constants/RiskTier");
const Industry_entity_1 = require("./Industry.entity");
let Company = class Company extends BaseEntity_1.BaseEntity {
};
exports.Company = Company;
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255 }),
    __metadata("design:type", String)
], Company.prototype, "legalName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: true }),
    __metadata("design:type", String)
], Company.prototype, "tradeName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 50, unique: true }),
    __metadata("design:type", String)
], Company.prototype, "taxId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: true, unique: true }),
    __metadata("design:type", String)
], Company.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "date", nullable: true }),
    __metadata("design:type", Date)
], Company.prototype, "foundedDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", nullable: true }),
    __metadata("design:type", Number)
], Company.prototype, "employeeCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 15, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Company.prototype, "annualRevenue", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], Company.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 100, nullable: true }),
    __metadata("design:type", String)
], Company.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 100, nullable: true }),
    __metadata("design:type", String)
], Company.prototype, "state", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 20, nullable: true }),
    __metadata("design:type", String)
], Company.prototype, "postalCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 50, nullable: true }),
    __metadata("design:type", String)
], Company.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 20, nullable: true }),
    __metadata("design:type", String)
], Company.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: true }),
    __metadata("design:type", String)
], Company.prototype, "website", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean", default: true }),
    __metadata("design:type", Boolean)
], Company.prototype, "canApplyForCredit", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], Company.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: RiskTier_1.RiskTier,
        nullable: true,
    }),
    __metadata("design:type", String)
], Company.prototype, "baseRiskTier", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: RiskTier_1.RiskTier,
        nullable: true,
    }),
    __metadata("design:type", String)
], Company.prototype, "adjustedRiskTier", void 0);
__decorate([
    (0, typeorm_1.Index)("ix_companies_owner_id"),
    (0, typeorm_1.ManyToOne)(() => User_entity_1.User, (u) => u.companies, {
        onDelete: "CASCADE",
        nullable: false,
    }),
    (0, typeorm_1.JoinColumn)({ name: "owner_id" }),
    __metadata("design:type", User_entity_1.User)
], Company.prototype, "owner", void 0);
__decorate([
    (0, typeorm_1.Index)("ix_companies_industry_id"),
    (0, typeorm_1.ManyToOne)(() => Industry_entity_1.Industry, (industry) => industry.companies, {
        nullable: true,
    }),
    (0, typeorm_1.JoinColumn)({ name: "industry_id" }),
    __metadata("design:type", Industry_entity_1.Industry)
], Company.prototype, "industry", void 0);
__decorate([
    (0, typeorm_1.RelationId)((c) => c.owner),
    __metadata("design:type", String)
], Company.prototype, "ownerId", void 0);
__decorate([
    (0, typeorm_1.RelationId)((c) => c.industry),
    __metadata("design:type", String)
], Company.prototype, "industryId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => CreditApplication_entity_1.CreditApplication, (application) => application.company),
    __metadata("design:type", Array)
], Company.prototype, "creditApplications", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Document_entity_1.Document, (document) => document.company),
    __metadata("design:type", Array)
], Company.prototype, "documents", void 0);
exports.Company = Company = __decorate([
    (0, typeorm_1.Entity)("companies")
], Company);
//# sourceMappingURL=Company.entity.js.map