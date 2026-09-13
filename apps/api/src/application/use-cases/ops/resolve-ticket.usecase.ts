import { ok, err, type Result, AppError } from '../../../core/contracts/index.js';
import { TicketModel } from '../../../infrastructure/database/schemas.js';

export async function resolveTicket(ticketId:string, resolverId:string, message:string): Promise<Result<any>>{
  const t = await TicketModel.findById(ticketId);
  if(!t) return err(AppError.notFound('Ticket'));
  t.status = 'RESOLVED';
  t.thread.push({ senderId: resolverId as any, senderName:'OPS', message, timestamp: new Date() } as any);
  await t.save();
  return ok(t);
}

export async function createTicket(input:{ clientId:string; subject:string; description:string; urgency?:string; source?:string }): Promise<Result<{id:string}>>{
  if(!input.subject) return err(AppError.validation('subject required'));
  const ticket = await TicketModel.create({
    clientId: input.clientId,
    subject: input.subject,
    description: input.description ?? input.subject,
    urgency: (input.urgency as any) ?? 'NORMAL',
    source: (input.source as any) ?? 'WEB_DASHBOARD',
    status: 'OPEN',
    thread: [],
  });
  return ok({ id:String(ticket._id) });
}


