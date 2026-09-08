import { ClientModel } from '../schemas.js';

export const ClientRepository = {
  findById: (id: string, tenant?: any) => {
    const filter: any = { _id: id };
    if (tenant?.clientId) filter._id = tenant.clientId;
    return ClientModel.findOne(filter).lean();
  },
  findAll: (tenant?: any) => {
    return ClientModel.find(tenant ?? {}).lean();
  },
  updateHealth: (id: string, health: number) => ClientModel.updateOne({ _id: id }, { $set: { healthScore: health } }),
  create: (data: any) => ClientModel.create(data),
};
