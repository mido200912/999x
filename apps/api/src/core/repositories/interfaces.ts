import type { Types } from 'mongoose';

export interface IRepository<T> {
  findById(id: Types.ObjectId, tenantFilter?: Record<string, unknown>): Promise<T | null>;
  findOne(filter: Record<string, unknown>): Promise<T | null>;
  find(filter: Record<string, unknown>): Promise<T[]>;
  create(data: Partial<T>): Promise<T>;
  update(id: Types.ObjectId, data: Partial<T>, tenantFilter?: Record<string, unknown>): Promise<T | null>;
  delete(id: Types.ObjectId, tenantFilter?: Record<string, unknown>): Promise<void>;
}

export interface IClientRepo extends IRepository<any> {}
export interface IReportRepo extends IRepository<any> {}
export interface IUserRepo extends IRepository<any> {}
export interface ITaskRepo extends IRepository<any> {}
export interface ITicketRepo extends IRepository<any> {}
