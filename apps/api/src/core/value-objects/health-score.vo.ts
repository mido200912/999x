export class HealthScore {
  private constructor(public readonly value: number) {}
  static create(n: number): HealthScore {
    if (n < 0 || n > 100 || Number.isNaN(n)) throw new Error('HealthScore must be 0-100');
    return new HealthScore(Math.round(n));
  }
  static compute(hr: number, churn: number, sponsor: number, exec: number): HealthScore {
    // 999x Pulse 360° formula: weighted blend (see landing computePulse)
    const v = Math.round(hr * 0.35 + (100 - churn) * 0.3 + sponsor * 0.2 + exec * 0.15);
    return HealthScore.create(v);
  }
  get label(): string {
    if (this.value >= 82) return 'ممتاز — جاهز للتوسع';
    if (this.value >= 68) return 'مستقر — يحتاج هيكلة';
    if (this.value >= 52) return 'هش — تدخل سريع';
    return 'حرج — إعادة بناء';
  }
}
