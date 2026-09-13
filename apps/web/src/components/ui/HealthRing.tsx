/**
 * components/ui/HealthRing.tsx — SVG Circular Health Score Ring
 * Animated fill based on score 0-100
 */
type Props = { score: number; size?: number; label?: string };

export function HealthRing({ score, size = 120, label = 'HEALTH' }: Props) {
  const r = (size - 16) / 2;
  const circ = 2 * Math.PI * r;
  const fill = circ * (1 - score / 100);
  const color = score >= 70 ? '#A3E635' : score >= 50 ? '#F59E0B' : '#EF4444';

  return (
    <div className="relative flex flex-col items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Background track */}
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
        {/* Animated fill */}
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={fill}
          style={{
            transition: 'stroke-dashoffset 1s cubic-bezier(0.34,1.56,0.64,1), stroke 0.5s ease',
            filter: `drop-shadow(0 0 8px ${color}88)`,
          }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-mono font-black text-[22px]" style={{ color }}>{score}</span>
        <span className="font-mono text-[9px] text-white/40 tracking-widest">{label}</span>
      </div>
    </div>
  );
}
