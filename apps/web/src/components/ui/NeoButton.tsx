/**
 * components/ui/NeoButton.tsx — Unified Button ( / )
 */
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'lime' | 'glass';
 to?: string; // Link
  children: ReactNode;
};

export function NeoButton({ variant = 'lime', to, children, className = '', ...props }: Props) {
  const base = variant === 'lime' ? 'btn-lime' : 'btn-glass';
  const cls = `${base} inline-flex items-center justify-center px-5 h-11 text-[13.5px] font-bold ${className}`;

  if (to) {
    return (
      <Link to={to} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button className={cls} {...props}>
      {children}
    </button>
  );
}