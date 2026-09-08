import { z } from 'zod';

export const ClientCategory = z.enum(['STARTUP', 'VOLUNTEER_TEAM', 'EVENT']);
export type ClientCategory = z.infer<typeof ClientCategory>;

export const OperationalStage = z.enum(['DIAGNOSIS', 'RESTRUCTURING', 'EXECUTION', 'COMPLETED']);

export const RegisterClientSchema = z.object({
  organizationName: z.string().min(2).max(120).trim(),
  category: ClientCategory,
  brandColor: z.string().regex(/^#([0-9a-fA-F]{6})$/).optional().default('#A3E635'),
  logoUrl: z.string().url().optional(),
  primaryContact: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(6),
    whatsappPhone: z.string().optional(),
  }),
  targetScope: z.enum(['HR', 'PR', 'SPONSORSHIP', 'FULL_OPS']).default('FULL_OPS'),
  assignedOpsLead: z.string().optional(),
});

export const SubmitPulseSchema = z.object({
  clientId: z.string().min(1),
  targetScope: z.enum(['HR', 'PR', 'SPONSORSHIP', 'FULL_OPS']),
  rawAnswers: z.record(z.unknown()),
  filesAttached: z.array(z.object({ name: z.string(), url: z.string().url(), sizeBytes: z.number() })).optional().default([]),
});

export type RegisterClientInput = z.infer<typeof RegisterClientSchema>;
export type SubmitPulseInput = z.infer<typeof SubmitPulseSchema>;
