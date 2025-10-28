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
exports.Industry = void 0;
const typeorm_1 = require("typeorm");
const BaseEntity_1 = require("./BaseEntity");
const Company_entity_1 = require("./Company.entity");
const RiskTier_1 = require("../constants/RiskTier");
let Industry = class Industry extends BaseEntity_1.BaseEntity {
};
exports.Industry = Industry;
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 100, unique: true }),
    __metadata("design:type", String)
], Industry.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: RiskTier_1.RiskTier,
        nullable: false,
    }),
    __metadata("design:type", String)
], Industry.prototype, "baseRiskTier", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], Industry.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Company_entity_1.Company, (company) => company.industry),
    __metadata("design:type", Array)
], Industry.prototype, "companies", void 0);
exports.Industry = Industry = __decorate([
    (0, typeorm_1.Entity)("industries")
], Industry);
//# sourceMappingURL=Industry.entity.js.map