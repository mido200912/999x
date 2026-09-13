/**
 * components/ui/GlassCard.tsx — Unified Glass Card
 * glass-panel + border-lime/16 + hover
 */
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: (e?: any) => void;
};

export function GlassCard({ children, className = '', hover = true, onClick }: Props) {
  return (
    <div onClick={onClick} className={`glass-panel rounded-2xl p-6 ${hover ? 'hover:border-[rgba(163,230,53,0.35)]' : ''} ${className}`}>
      {children}
    </div>
  );
}