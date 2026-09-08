import { ok, err, type Result, AppError } from '../../core/contracts/index.js';
import { ClientModel } from '../../../infrastructure/database/schemas.js';
import { HealthScore } from '../../../core/value-objects/health-score.vo.js';

export async function registerClient(input: { organizationName:string; category:any; primaryContact:any; assignedOpsLead?:string }): Promise<Result<{id:string}>> {
  if (!input.organizationName || input.organizationName.length < 2) return err(AppError.validation('organizationName too short'));
  const health = HealthScore.create(70);
  const doc = await ClientModel.create({
    organizationName: input.organizationName.trim(),
    category: input.category,
    primaryContact: input.primaryContact,
    healthScore: health.value,
    assignedOpsLead: input.assignedOpsLead ?? '000000000000000000000001',
    operationalStage: 'DIAGNOSIS',
  });
  return ok({ id: String(doc._id) });
}

