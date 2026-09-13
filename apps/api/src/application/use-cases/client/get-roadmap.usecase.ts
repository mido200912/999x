import { ok, err, type Result, AppError } from '../../../core/contracts/index.js';
import { ClientModel, AIReportModel } from '../../../infrastructure/database/schemas.js';

export async function getRoadmap(clientId:string, tenantFilter?:any): Promise<Result<any>>{
  if(tenantFilter?.clientId && String(tenantFilter.clientId)!==String(clientId)) return err(AppError.forbidden('Tenant mismatch'));
  const client = await ClientModel.findById(clientId).lean();
  if(!client) return err(AppError.notFound('Client'));
  const reports = await AIReportModel.find({ clientId }).sort({ createdAt:-1 }).lean();
  const stations = [
    { id:'DIAGNOSIS', title:'التشخيص والتنظيف', titleEn:'Diagnosis', status: client.operationalStage==='DIAGNOSIS' ? 'IN_PROGRESS' : 'DONE', deliverables: reports.filter(r=>r.reportType==='MONTHLY_AUDIT').slice(0,1) },
    { id:'RESTRUCTURING', title:'اعتماد الهيكل التنظيمي', titleEn:'RACI Approval', status: client.operationalStage==='RESTRUCTURING' ? 'IN_PROGRESS' : client.operationalStage==='DIAGNOSIS' ? 'PENDING' : 'DONE', deliverables: reports.filter(r=>r.reportType==='HR_RESTRUCTURING') },
    { id:'EXECUTION', title:'إطلاق حملة الرعاة', titleEn:'Sponsor Launch', status: client.operationalStage==='EXECUTION' ? 'IN_PROGRESS' : 'PENDING', deliverables: reports.filter(r=>r.reportType==='SPONSOR_PITCH') },
    { id:'COMPLETED', title:'المتابعة والتقييم', titleEn:'Follow-up', status: client.operationalStage==='COMPLETED' ? 'DONE' : 'PENDING', deliverables: [] },
  ];
  return ok({ client, stations, health: client.healthScore });
}


