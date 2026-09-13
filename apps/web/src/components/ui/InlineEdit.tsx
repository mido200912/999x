/**
 * components/ui/InlineEdit.tsx — Reusable inline-edit cell
 * Click-to-edit with async onSave support, saving spinner, Enter/Escape handling.
 */
import React, { useState, useEffect, useRef } from 'react';
import { Pencil, Loader2 } from 'lucide-react';

interface InlineEditProps {
  value: string;
  /** May return a Promise — spinner shown until it resolves. */
  onSave: (val: string) => void | Promise<void>;
  type?: 'text' | 'textarea' | 'number';
  className?: string;
  inputClassName?: string;
  placeholder?: string;
}

export const InlineEdit: React.FC<InlineEditProps> = ({
  value,
  onSave,
  type = 'text',
  className = '',
  inputClassName = '',
  placeholder = 'Click to edit...',
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  // Keep local state in sync when parent value changes (e.g. after refresh)
  useEffect(() => {
    setTempValue(value);
  }, [value]);

  // Auto-focus when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      // Select all text for quick replacement
      if (inputRef.current instanceof HTMLInputElement) {
        inputRef.current.select();
      }
    }
  }, [isEditing]);

  const handleSave = async () => {
    setIsEditing(false);
    if (tempValue.trim() === value.trim()) return; // No change
    setSaving(true);
    try {
      const result = onSave(tempValue.trim());
      if (result instanceof Promise) await result;
    } finally {
      setSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && type !== 'textarea') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      setTempValue(value); // Revert
      setIsEditing(false);
    }
  };

  // ── Editing state ──────────────────────────────────────────────────────────
  if (isEditing) {
    const sharedProps = {
      value: tempValue,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setTempValue(e.target.value),
      onBlur: handleSave,
      onKeyDown: handleKeyDown,
    };

    if (type === 'textarea') {
      return (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          {...sharedProps}
          rows={3}
          className={`bg-canvas/80 border border-lime/40 text-pistachio rounded-lg px-2 py-1.5 outline-none focus:border-lime focus:shadow-[0_0_0_2px_rgba(163,230,53,0.15)] w-full min-h-[60px] text-[13px] resize-none transition-all ${inputClassName}`}
        />
      );
    }

    return (
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type={type}
        {...sharedProps}
        className={`bg-canvas/80 border border-lime/40 text-pistachio rounded-lg px-2 py-0.5 outline-none focus:border-lime focus:shadow-[0_0_0_2px_rgba(163,230,53,0.15)] w-full text-[13px] transition-all ${inputClassName}`}
      />
    );
  }

  // ── Display state ──────────────────────────────────────────────────────────
  return (
    <span
      onClick={() => !saving && setIsEditing(true)}
      className={`group relative cursor-pointer hover:bg-white/5 rounded px-1 -mx-1 transition-colors inline-flex items-center gap-1.5 ${saving ? 'pointer-events-none' : ''} ${className}`}
      title={saving ? 'Saving...' : 'Click to edit'}
    >
      <span className={saving ? 'text-white/50' : ''}>
        {value || <span className="text-white/30 italic text-[12px]">{placeholder}</span>}
      </span>
      {saving ? (
        <Loader2 className="w-3 h-3 text-lime/70 animate-spin shrink-0" />
      ) : (
        <Pencil className="w-3 h-3 text-white/0 group-hover:text-lime/60 transition-colors shrink-0" />
      )}
    </span>
  );
};
