import { AppDataSource } from '../config/data-source';
import { CreditApplication } from '../entities/CreditApplication.entity';
import { Like } from 'typeorm'; 

const creditApplicationRepository = AppDataSource.getRepository(CreditApplication);

export const generateUniqueCode = async (prefix: string = 'CRD'): Promise<string> => {
  const currentYear = new Date().getFullYear();
  const codePrefix = `#${prefix}-${currentYear}-`;

  const lastDocument = await creditApplicationRepository.findOne({
    where: { applicationNumber: Like(`${codePrefix}%`) },  
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


export default { generateUniqueCode };