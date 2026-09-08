import { z } from 'zod';

export const ModelEngine = z.enum([
  'minimax/minimax-m3:free',
  'anthropic/claude-3.5-sonnet',
  'openai/gpt-4o',
  'deepseek/deepseek-r1',
]);

export const GeneratePlanSchema = z.object({
  clientId: z.string(),
  reportType: z.enum(['HR_RESTRUCTURING', 'PR_CAMPAIGN', 'SPONSOR_PITCH', 'MONTHLY_AUDIT']),
  modelEngine: ModelEngine.default('minimax/minimax-m3:free'),
  problemType: z.string().optional(),
  stream: z.boolean().optional().default(false),
});

export const PulseMetricsSchema = z.object({
  hrStabilityScore: z.number().min(0).max(100),
  churnRiskRate: z.number().min(0).max(100),
  sponsorReadiness: z.number().min(0).max(100),
  executionSpeed: z.number().min(0).max(100),
});

export const AIMilestoneSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  dueDateOffsetDays: z.number().default(7),
  assignedRole: z.string().optional(),
  status: z.enum(['PENDING', 'APPROVED', 'IN_PROGRESS', 'DONE']).default('PENDING'),
});

export type GeneratePlanInput = z.infer<typeof GeneratePlanSchema>;
export type PulseMetrics = z.infer<typeof PulseMetricsSchema>;
