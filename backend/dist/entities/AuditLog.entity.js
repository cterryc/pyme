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
exports.AuditLog = void 0;
const typeorm_1 = require("typeorm");
const BaseEntity_1 = require("./BaseEntity");
const User_entity_1 = require("./User.entity");
let AuditLog = class AuditLog extends BaseEntity_1.BaseEntity {
};
exports.AuditLog = AuditLog;
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 100 }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], AuditLog.prototype, "action", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 100 }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], AuditLog.prototype, "entityType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], AuditLog.prototype, "entityId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "jsonb", nullable: true }),
    __metadata("design:type", Object)
], AuditLog.prototype, "oldValues", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "jsonb", nullable: true }),
    __metadata("design:type", Object)
], AuditLog.prototype, "newValues", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 50, nullable: true }),
    __metadata("design:type", String)
], AuditLog.prototype, "ipAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], AuditLog.prototype, "userAgent", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], AuditLog.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: "user_id" }),
    __metadata("design:type", User_entity_1.User)
], AuditLog.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "user_id", nullable: true }),
    __metadata("design:type", String)
], AuditLog.prototype, "userId", void 0);
exports.AuditLog = AuditLog = __decorate([
    (0, typeorm_1.Entity)("audit_logs")
], AuditLog);
