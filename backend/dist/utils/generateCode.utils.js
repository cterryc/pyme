"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUniqueCode = void 0;
const data_source_1 = require("../config/data-source");
const CreditApplication_entity_1 = require("../entities/CreditApplication.entity");
const typeorm_1 = require("typeorm");
const creditApplicationRepository = data_source_1.AppDataSource.getRepository(CreditApplication_entity_1.CreditApplication);
const generateUniqueCode = async (prefix = 'CRD') => {
    const currentYear = new Date().getFullYear();
    const codePrefix = `#${prefix}-${currentYear}-`;
    const lastDocument = await creditApplicationRepository.findOne({
        where: { applicationNumber: (0, typeorm_1.Like)(`${codePrefix}%`) },
        order: { applicationNumber: 'DESC' },
    });
    let nextSequence = 1;
    if (lastDocument) {
        const lastSeqStr = lastDocument.applicationNumber.split('-')[2];
        nextSequence = parseInt(lastSeqStr, 10) + 1;
    }
    const sequenceStr = nextSequence.toString().padStart(6, '0');
    return `${codePrefix}${sequenceStr}`;
};
exports.generateUniqueCode = generateUniqueCode;
exports.default = { generateUniqueCode: exports.generateUniqueCode };
