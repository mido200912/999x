import { createHash } from 'node:crypto';

export async function generateBrandedPdf(report: { title: string; clientName: string; executiveSummary: string; }): Promise<{ url: string; hash: string; qrData: string }> {
  const verificationHash = createHash('sha256').update(`${report.clientName}::${report.title}::${Date.now()}`).digest('hex').slice(0, 16);
  const qrData = `https://999x.earth/verify/${verificationHash}`;
  // In production this uses @react-pdf/renderer + headless Chromium (300 DPI, violet/lime gradient, client logo, QR)
  // For now we return a deterministic mock URL
  const url = `https://cdn.999x.earth/reports/${verificationHash}.pdf`;
  console.log(`[999x] PDF branded ${report.title} -> ${url}`);
  return { url, hash: verificationHash, qrData };
}
