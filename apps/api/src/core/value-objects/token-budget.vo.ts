export class TokenBudget {
  constructor(public readonly monthlyLimit: number, public tokensUsed: number) {}
  get remaining(): number { return Math.max(0, this.monthlyLimit - this.tokensUsed); }
  get usagePct(): number { return this.monthlyLimit === 0 ? 0 : (this.tokensUsed / this.monthlyLimit) * 100; }
  canConsume(tokens: number): boolean { return this.tokensUsed + tokens <= this.monthlyLimit; }
  consume(tokens: number): void {
    if (!this.canConsume(tokens)) throw new Error('QUOTA_EXCEEDED');
    this.tokensUsed += tokens;
  }
}
