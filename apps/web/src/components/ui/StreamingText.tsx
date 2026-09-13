/**
 * components/ui/StreamingText.tsx — SSE Typewriter Effect Component
 * Shows tokens arriving from AI stream with blinking cursor
 */
import { useEffect, useRef } from 'react';

type Props = {
  text: string;
  className?: string;
  showCursor?: boolean;
  isStreaming?: boolean;
};

export function StreamingText({ text, className = '', showCursor = true, isStreaming = false }: Props) {
  const ref = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [text]);

  return (
    <pre
      ref={ref}
      className={`whitespace-pre-wrap font-mono text-[12px] text-lime leading-relaxed overflow-auto ${className}`}
    >
      {text}
      {showCursor && isStreaming && (
        <span
          className="inline-block w-2 h-4 bg-lime ml-0.5 align-middle"
          style={{ animation: 'blink 0.8s step-end infinite' }}
        />
      )}
      {/* Inject blink keyframe once */}
      <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
    </pre>
  );
}
