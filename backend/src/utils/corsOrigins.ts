/**
 * Parse FRONTEND_URL: comma-separated list or single origin for CORS.
 */
export function getCorsOrigins(): string | string[] {
  const raw = process.env.FRONTEND_URL?.trim();
  if (!raw) {
    return ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'];
  }
  const parts = raw.split(',').map((s) => s.trim()).filter(Boolean);
  return parts.length === 1 ? parts[0] : parts;
}

/** First origin or SITE_URL for absolute links in emails / Paystack callback */
export function getPrimarySiteUrl(): string {
  const site = process.env.SITE_URL?.trim();
  if (site) return site.replace(/\/$/, '');
  const raw = process.env.FRONTEND_URL?.trim();
  if (raw) return raw.split(',')[0].trim().replace(/\/$/, '');
  return 'http://localhost:5173';
}
