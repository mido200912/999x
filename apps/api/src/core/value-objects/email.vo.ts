export class Email {
  private constructor(public readonly value: string) {}
  static create(raw: string): Email {
    const v = raw.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) throw new Error(`Invalid email: ${raw}`);
    return new Email(v);
  }
  toString() { return this.value; }
  equals(other: Email) { return this.value === other.value; }
}
