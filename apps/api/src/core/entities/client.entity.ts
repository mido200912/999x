import { HealthScore } from '../value-objects/health-score.vo.js';
import { TokenBudget } from '../value-objects/token-budget.vo.js';

export type ClientCategory = 'STARTUP' | 'VOLUNTEER_TEAM' | 'EVENT';
export type OperationalStage = 'DIAGNOSIS' | 'RESTRUCTURING' | 'EXECUTION' | 'COMPLETED';

export class Client {
  constructor(
    public id: string,
    public organizationName: string,
    public category: ClientCategory,
    public primaryContact: { name: string; email: string; phone: string; whatsappPhone?: string },
    public operationalStage: OperationalStage,
    public healthScore: HealthScore,
    public tokenBudget: TokenBudget,
    public assignedOpsLead: string,
  ) {}

  static create(data: Omit<Client, 'healthScore'|'tokenBudget'> & { healthScore?: number; tokenBudget?: { monthlyLimit:number; tokensUsed:number } }): Client {
    return new Client(
      data.id,
      data.organizationName,
      data.category,
      data.primaryContact as any,
      data.operationalStage,
      HealthScore.create((data as any).healthScore ?? 70),
      new TokenBudget(data.tokenBudget?.monthlyLimit ?? 200000, data.tokenBudget?.tokensUsed ?? 0),
      data.assignedOpsLead,
    );
  }

  advanceStage(): void {
    const order: OperationalStage[] = ['DIAGNOSIS','RESTRUCTURING','EXECUTION','COMPLETED'];
    const idx = order.indexOf(this.operationalStage);
    if (idx < order.length-1) this.operationalStage = order[idx+1];
  }

  canConsumeAI(tokens: number): boolean { return this.tokenBudget.canConsume(tokens); }
}
