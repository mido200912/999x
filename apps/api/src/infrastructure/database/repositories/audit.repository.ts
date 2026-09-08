import { AuditLogModel } from '../schemas.js';
import type { Types } from 'mongoose';

export async function logAudit(params: { actorId: Types.ObjectId; actorEmail: string; action: string; resource: string; resourceId?: string; ip: string; ua: string; metadata?: any }){
  await AuditLogModel.create({
    actorId: params.actorId,
    actorEmail: params.actorEmail,
    action: params.action,
    resource: params.resource,
    resourceId: params.resourceId,
    ipAddress: params.ip,
    userAgent: params.ua,
    metadata: params.metadata,
    timestamp: new Date(),
  });
}
