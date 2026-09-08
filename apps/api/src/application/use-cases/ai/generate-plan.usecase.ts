import { ok, err, type Result, AppError } from '../../core/contracts/index.js';
import { AIReportModel, ClientModel } from '../../../infrastructure/database/schemas.js';
import { generateBrandedPdf } from '../../../infrastructure/pdf/branded-pdf.js';
import { createHash } from 'node:crypto';

export async function generatePlan(input:{ clientId:string; reportType:any; modelEngine?:string; content?:any }): Promise<Result<{id:string; verificationHash:string; pdf:any}>> {
  const client = await ClientModel.findById(input.clientId).lean();
  if(!client) return err(AppError.notFound('Client'));
  // token budget check
  const budget = client.tokenBudget as any;
  if(budget.tokensUsed + 3500 > budget.monthlyLimit) return err(AppError.quotaExceeded());
  await ClientModel.updateOne({ _id: client._id }, { $inc: { 'tokenBudget.tokensUsed': 3500 } });

  const verificationHash = createHash('sha256').update(`${input.clientId}${Date.now()}`).digest('hex').slice(0,16);
  const report = await AIReportModel.create({
    clientId: input.clientId,
    reportType: input.reportType ?? 'HR_RESTRUCTURING',
    modelEngine: input.modelEngine ?? 'minimax/minimax-m3:free',
    version: 1,
    content: input.content ?? { title:'خطة HR — 999x', executiveSummary:'ملخص تنفيذي', milestones:[{id:'m1', title:'RACI', description:'تحديد مسؤول', dueDateOffsetDays:7, status:'PENDING'}], strategicDirectives:['Kanban'], riskMitigations:[{risk:'تسرب', solution:'Onboarding'}]},
    verificationHash,
  });
  const pdf = await generateBrandedPdf({ title: report.content.title, clientName: client.organizationName, executiveSummary: report.content.executiveSummary });
  report.pdfExportUrl = pdf.url; await report.save();
  return ok({ id:String(report._id), verificationHash, pdf });
}

