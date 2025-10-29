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
exports.Signature = void 0;
const typeorm_1 = require("typeorm");
const BaseEntity_1 = require("./BaseEntity");
const CreditApplication_entity_1 = require("./CreditApplication.entity");
let Signature = class Signature extends BaseEntity_1.BaseEntity {
};
exports.Signature = Signature;
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: false }),
    __metadata("design:type", String)
], Signature.prototype, "docHash", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: false }),
    __metadata("design:type", String)
], Signature.prototype, "docId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 500, nullable: true }),
    __metadata("design:type", String)
], Signature.prototype, "docUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 500, nullable: true }),
    __metadata("design:type", String)
], Signature.prototype, "callback", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 500, nullable: true }),
    __metadata("design:type", String)
], Signature.prototype, "returnUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], Signature.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: true }),
    __metadata("design:type", String)
], Signature.prototype, "externalRef", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => CreditApplication_entity_1.CreditApplication, (creditApplication) => creditApplication.signature, {
        onDelete: "CASCADE",
    }),
    (0, typeorm_1.JoinColumn)({ name: "credit_application_id" }),
    __metadata("design:type", CreditApplication_entity_1.CreditApplication)
], Signature.prototype, "creditApplication", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "credit_application_id", nullable: true }),
    __metadata("design:type", String)
], Signature.prototype, "creditApplicationId", void 0);
exports.Signature = Signature = __decorate([
    (0, typeorm_1.Entity)("signatures")
], Signature);
