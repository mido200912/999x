/**
 * components/ui/PDFExportModal.tsx — PDF Export Modal with QR Display
 * Shows verification hash, QR code, and download link after PDF generation.
 * 999x.md §3 — Branded Executive PDF Generator
 */
import { NeoButton } from './NeoButton';

type PDFModalData = {
  url: string;
  qr: string;
  hash: string;
};

type Props = {
  data: PDFModalData | null;
  onClose: () => void;
  clientName?: string;
};

export function PDFExportModal({ data, onClose, clientName = '999x Client' }: Props) {
  if (!data) return null;

  const copyHash = () => {
    navigator.clipboard.writeText(data.hash);
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(data.qr);
  };

  return (
    <div
      className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 z-50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="PDF Export Modal"
    >
      <div
        className="glass-panel rounded-3xl p-7 w-full max-w-[520px] shadow-[0_30px_80px_rgba(0,0,0,0.7),0_0_40px_rgba(163,230,53,0.08)]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="text-[40px] mb-1">📄</div>
            <h3 className="font-display font-bold text-pistachio text-[22px]">Executive Report Ready!</h3>
            <p className="text-white/40 text-[13px] mt-1">Branded 999x report for <span className="text-lime">{clientName}</span></p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 text-white/50 hover:bg-white/20 hover:text-white transition-all flex items-center justify-center text-[14px]"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* QR Code Display */}
        <div className="mb-5 p-5 rounded-2xl bg-white flex items-center justify-center">
          {/* SVG QR placeholder — in prod would be a real QR image */}
          <div className="w-32 h-32 relative">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Simple QR-like pattern */}
              <rect width="100" height="100" fill="white" />
              {/* Corner squares */}
              <rect x="5" y="5" width="25" height="25" fill="none" stroke="#160322" strokeWidth="5" />
              <rect x="10" y="10" width="15" height="15" fill="#160322" />
              <rect x="70" y="5" width="25" height="25" fill="none" stroke="#160322" strokeWidth="5" />
              <rect x="75" y="10" width="15" height="15" fill="#160322" />
              <rect x="5" y="70" width="25" height="25" fill="none" stroke="#160322" strokeWidth="5" />
              <rect x="10" y="75" width="15" height="15" fill="#160322" />
              {/* Center logo */}
              <rect x="38" y="38" width="24" height="24" rx="4" fill="#A3E635" />
              <text x="50" y="54" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#160322">999x</text>
              {/* Data modules */}
              <rect x="40" y="5" width="5" height="5" fill="#160322" />
              <rect x="50" y="5" width="5" height="5" fill="#160322" />
              <rect x="60" y="5" width="5" height="5" fill="#160322" />
              <rect x="5" y="40" width="5" height="5" fill="#160322" />
              <rect x="5" y="50" width="5" height="5" fill="#160322" />
              <rect x="5" y="60" width="5" height="5" fill="#160322" />
              <rect x="40" y="90" width="5" height="5" fill="#160322" />
              <rect x="50" y="90" width="5" height="5" fill="#160322" />
              <rect x="60" y="90" width="5" height="5" fill="#160322" />
              <rect x="90" y="40" width="5" height="5" fill="#160322" />
              <rect x="90" y="50" width="5" height="5" fill="#160322" />
              <rect x="90" y="60" width="5" height="5" fill="#160322" />
            </svg>
          </div>
        </div>
        <p className="text-[11px] font-mono text-white/30 text-center mb-5">Scan to verify report authenticity at 999x.earth</p>

        {/* Hash & Verify URL */}
        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-canvas border border-lime/20">
            <div className="flex justify-between items-center mb-1.5">
              <div className="text-[10px] font-mono text-white/30 tracking-widest">CRYPTOGRAPHIC HASH</div>
              <button onClick={copyHash} className="text-[10px] font-mono text-lime/70 hover:text-lime transition-colors">Copy</button>
            </div>
            <div className="font-mono text-lime text-[12px] break-all">{data.hash}</div>
          </div>

          <div className="p-4 rounded-2xl bg-canvas border border-white/10">
            <div className="flex justify-between items-center mb-1.5">
              <div className="text-[10px] font-mono text-white/30 tracking-widest">VERIFICATION URL</div>
              <button onClick={copyUrl} className="text-[10px] font-mono text-lime/70 hover:text-lime transition-colors">Copy</button>
            </div>
            <div className="font-mono text-pistachio/60 text-[11px] break-all">{data.qr}</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <a href={data.url} target="_blank" rel="noopener noreferrer" className="flex-1">
            <NeoButton className="w-full" id="pdf-open-btn">⬇ Open PDF</NeoButton>
          </a>
          <NeoButton variant="glass" onClick={copyHash} id="pdf-copy-hash-btn">Copy Hash</NeoButton>
        </div>
        <button onClick={onClose} className="w-full mt-3 text-[12px] text-white/30 hover:text-white/60 transition-colors">
          Close
        </button>
      </div>
    </div>
  );
}
