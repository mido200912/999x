import { ok, err, type Result, AppError } from '../../../core/contracts/index.js';
import { TaskModel } from '../../../infrastructure/database/schemas.js';

export async function assignTask(input:{ clientId:string; title:string; assignedOpsMember:string; priority?:string; deadline: string }): Promise<Result<{id:string}>>{
  if(!input.title || input.title.length < 3) return err(AppError.validation('title too short'));
  const task = await TaskModel.create({
    clientId: input.clientId,
    assignedOpsMember: input.assignedOpsMember,
    title: input.title,
    details: input.title,
    columnStatus: 'TODO',
    priority: (input.priority as any) ?? 'MEDIUM',
    deadline: new Date(input.deadline),
  });
  return ok({ id:String(task._id) });
}

export async function moveTask(id:string, columnStatus:string): Promise<Result<any>>{
  const allowed = ['BACKLOG','TODO','IN_PROGRESS','IN_REVIEW','COMPLETED'];
  if(!allowed.includes(columnStatus)) return err(AppError.validation('invalid status'));
  const task = await TaskModel.findByIdAndUpdate(id, { columnStatus }, { new:true }).lean();
  if(!task) return err(AppError.notFound('Task'));
  return ok(task);
}


