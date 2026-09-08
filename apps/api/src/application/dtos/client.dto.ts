import { z } from 'zod';
import { ClientCategory } from '../../core/entities/client.entity.js';

export const CreateClientDto = z.object({
  organizationName: z.string().min(2).max(120),
  category: z.enum(['STARTUP','VOLUNTEER_TEAM','EVENT']),
  primaryContact: z.object({ name: z.string(), email: z.string().email(), phone: z.string(), whatsappPhone: z.string().optional() }),
  operationalStage: z.enum(['DIAGNOSIS','RESTRUCTURING','EXECUTION','COMPLETED']).default('DIAGNOSIS'),
  assignedOpsLead: z.string().optional(),
});

export type CreateClientDto = z.infer<typeof CreateClientDto>;
export type ClientResponseDto = {
  id: string;
  organizationName: string;
  category: ClientCategory;
  healthScore: number;
  operationalStage: string;
  tokenBudget: { monthlyLimit:number; tokensUsed:number; remaining:number };
};
